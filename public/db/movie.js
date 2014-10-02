var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var movieSchema = new Schema({
    _id: String,
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
    file: String,
    normalizedfile: String,
    thumbnail: String,
    miniature: String,
    tag: [String],
    tagline: [String],
    plot: String,
    plotoutline: String,
    dateadded: String,
    trailer: String
});

