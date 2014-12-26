var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var async = require('async');
var request = require('request');
var url = require('url');
var fs = require('fs');
var _ = require('lodash');

// AUth
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Fichiers de configuration
var config = require('./config/config');


// DB: Load Schemas
var userSchema = require('./public/db/user');
var movieSchema = require('./public/db/movie');
var orderSchema = require('./public/db/order');
// DB: Compile Models

var User = mongoose.model('User');
var Movie = mongoose.model('Movie');
// var Cart = mongoose.model('Cart');
var Order = mongoose.model('Order');
// Connect to DB
mongoose.connect(config.mongodb.hostname);

// Passport Auth Configuration
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        next();
    else
        res.send(401);
}

passport.use(new LocalStrategy({usernameField: 'email'}, function(email, password, done) {
    User.findOne({email: email}, function(err, user) {
        if (err)
            return done(err);
        if (!user)
            return done(null, false);
        user.comparePassword(password, function(err, isMatch) {
            if (err)
                return done(err);
            if (isMatch)
                return done(null, user);
            return done(null, false);
        });
    });
}));

var app = express();

app.set('port', process.env.PORT || config.app.port || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(cookieParser());

// Passwords Setup
app.use(session({secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
//  If user is authenticated, this will create a new cookie that will be 
//  consumed by our AngularJS authentication service to read user information
app.use(function(req, res, next) {
    if (req.user) {
        res.cookie('user', JSON.stringify(req.user));
    }
    next();
});

app.get('/api/movies', function(req, res, next) {
    var query = Movie.find();
    if (req.query.genre) {
        query.where({genre: req.query.genre});
    } else if (req.query.alphabet) {
		if (req.query.alphabet && req.query.alphabet === '#') {
			query.where({title: new RegExp('^' + '[^a-zA-Z0-9]', 'i')});
		}
		else {
			query.where({title: new RegExp('^' + '[' + req.query.alphabet + ']', 'i')});
		}
    } else {
        query.limit(12);
    }
    query.exec(function(err, movies) {
        if (err)
            return next(err);
        res.send(movies);
    });
});

app.get('/api/movies/:id', function(req, res, next) {
    Movie.findById(req.params.id, function(err, movie) {
        if (err)
            return next(err);
        res.send(movie);
    });
});

app.get('/api/library/genres', function(req, res, next) {
	Movie.find().distinct('genre', function(err, ids) {
        if (err)
            return next(err);
		if (ids)
			ids = ids.sort(); 
        res.send(ids);
	});
});	

app.get('/api/library/alphabet', function(req, res, next) {

	Movie.aggregate(
		{ $group: {_id: {$substr: ["$title", 0, 1]}}}
	  , { $project: { _id: 1 }}
	  , { $sort : {_id : 1}}
	  , function (err, alpha) {
			if (err)
				return next(err);
			console.log(alpha);
			res.send(alpha);
		}
	);
});	

app.get('/api/loaddb', function(req, res, next) {
    // Load from config file
    // var __file = "public/static/export_xbmc.json";
    var __file = path.join('public/static/', config.remotedb.parser);
    console.log("Database Refresh Process Initiated:");

    async.waterfall([
        function(callback) {
            console.log(".Reading JSON movie query ...");
            fs.readFile(__file, 'utf8', function(error, data) {
                if (error)
                    return next(error);
                var jsonQuery = JSON.parse(data);
                if (!data) {
                    return res.send(400, {
                        message: 'Could not load json query.'
                    });
                }
                // console.dir(jsonQuery);
                var urlOpt = config.remotedb.url;
                var authOpt = config.remotedb.auth;
                urlOpt.query.request = data;

                var destUrl = url.format(urlOpt);

                callback(error, destUrl, authOpt);
            });
        },
        function(destUrl, authOpt, callback) {
            request.get(destUrl, authOpt, function(error, resp, body) {
                if (error)
                    return next(error);

                console.log(".Retrieving movies from main server ...");

                if (!body) {
                    return res.send(400, {
                        message: 'Could not retrieve data.'
                    });
                }

                var libMovies = JSON.parse(body);
                var movies = libMovies.result.movies;
                if (!movies) {
                    return res.send(400, {
                        message: 'No movies found.'
                    });
                } else {
                    var nbmovies = movies.length;
                    console.log(".Found " + nbmovies + " movies.");
                    // res.send(movies);
                    callback(error, movies, nbmovies);
                }
            });
        },
        function(movies, nbmovies, callback) {
            var nbcb = 0;
            console.log(".Storing data into MongoDB ...");
            async.forEach(movies, function(mov) {
                // Compute Thumbnail Path
                var tbn = path.normalize(mov.file);			
                tbn = tbn.substring(tbn.lastIndexOf(path.sep) + 1, tbn.lastIndexOf("."));
                var minitbn = tbn + "-mini.jpg";
                tbn = tbn + "-poster.jpg";
				
				console.log(mov.genre);	
				// Clean falsy values
				mov.genre = _.compact(mov.genre);
				console.log(mov.genre);

                // Generate Movie Object
                var movie = new Movie({
                    title: mov.title,
                    originaltitle: mov.originaltitle,
                    sorttitle: mov.sorttitle,
                    genre: mov.genre,
                    year: mov.year,
                    rating: mov.rating,
                    country: mov.country,
                    runtime: mov.runtime,
                    director: mov.director,
                    cast: [{
                            name: mov.name,
                            order: mov.order,
                            role: mov.role,
                            thumbnail: mov.thumbnail
                        }],
                    writer: mov.writer,
                    studio: mov.studio,
                    mpaa: mov.mpaa,
                    imdbnumber: mov.imdbnumber,
                    showlink: mov.showlink,
                    streamdetails: {
                        audio: [{
                                channels: mov.channels,
                                codec: mov.codec,
                                language: mov.language
                            }],
                        subtitle: mov.subtitle,
                        video: [{
                                aspect: mov.aspect,
                                codec: mov.codec,
                                duration: mov.duration,
                                height: mov.height,
                                stereomode: mov.stereomode,
                                width: mov.width
                            }]
                    },
                    file: mov.file,
                    normalizedfile: path.normalize(mov.file),
                    thumbnail: tbn,
                    miniature: minitbn,
                    tag: mov.tag,
                    tagline: mov.tagline,
                    plot: mov.plot,
                    plotoutline: mov.plotoutline,
                    dateadded: mov.dateadded,
                    trailer: mov.trailer
                });

                // Save movie and callback on list complete processing
                movie.save(function(err) {
                    nbcb++;
                    if (err) {
                        if (err.code == 11000) {
                            console.log("...Skipping " + mov.title + ': Movie exists.');
                        } else {
                            return next(err);
                        }
                    } else {
                        console.log('...' + mov.title);
                    }
                    if (nbcb === nbmovies) {
                        callback(null, nbmovies);
					}
                });
            });
        }
    ], function(err, nbmovies) {
        if (!err) {
        console.log('.Done refreshing DB.');
        return res.send(200, {
            message: 'Database refreshed with ' + (nbmovies || 0) + ' movies.'
        });
        } else {
            return res.send(500, {
                message: err.message
        });
        }
    });
});

// Auth Routes
app.post('/api/login', passport.authenticate('local'), function(req, res) {
    res.cookie('user', JSON.stringify(req.user));
    res.send(req.user);
});

app.post('/api/signup', function(req, res, next) {
    var user = new User({
        email: req.body.email,
        password: req.body.password
    });
    user.save(function(err) {
        if (err)
            return next(err);
        res.send(200);
    });
});

app.post('/api/orders', function(req, res, next) {
    try {
        console.log("Parsing order ...");
        if (!req.body.owner || !req.body.items) {
            throw new Error("Bad error");
        }
        var order = new Order({
            owner: req.body.owner,
            status: "pending",
            items: []
        });
        _.each(req.body.items, function(item) {
            order.items.push({movie: item.toString(), status: "pending"});
        });
        order.save(function(err, ord) {
            console.log("Saving order ...");
            if (err)
                return next(err);
            console.log("Order saved: " + ord._id);
        });
        res.send(req.body);
    } catch (e) {
        res.send(500, {message: "Order failure: " + e.message});
    }
});

app.get('/api/carts', function(req, res, next) {
    req.logout();
    res.send(200);
});

app.get('/api/logout', function(req, res, next) {
    req.logout();
    res.send(200);
});

// Redirection Route
app.get('*', function(req, res) {
    res.redirect('/#' + req.originalUrl);
});

// Error Handler Route
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500, {message: err.message});
});

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
