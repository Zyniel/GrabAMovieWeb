var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId;

var movieSchema = new Schema({
    title: String,
    originaltitle: String,
    sorttitle: String,	
    genre: [String],
    year: String,
    rating: Number,
    country: [String],
    runtime: Number,
    director: [String],
    cast: [{
            name: String,
            order: Number,
            role: String,
            thumbnail: String
        }],
    writer: [String],
    studio: [String],
    mpaa: String,
    imdbnumber: String,
    showlink: [String],
    streamdetails: {
        audio: [{
                channels: Number,
                codec: String,
                language: String
            }],
        subtitle: [String],
        video: [{
                aspect: Number,
                codec: String,
                duration: Number,
                height: Number,
                stereomode: String,
                width: Number
            }]
    },
    file: { type: String, required : true, unique: true },
    normalizedfile: String,
    imagenoext: String,
    tag: [String],
    tagline: [String],
    plot: String,
    plotoutline: String,
    dateadded: String,
    trailer: String
});

mongoose.model('Movie', movieSchema);
