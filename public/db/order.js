var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Order Schema
var orderSchema = new Schema({
    _someId: Schema.Types.ObjectId,
    owner: {
        type: String,
        ref: 'userSchema',
        required: true
    },
    status: {
        type: String,
        required: true
    },
    items: [{
            movie: {
                type: String,
                ref: 'movieSchema',
                required: true
            },
            status: {
                type: String,
                required: true,
                default: 'pending'
            }
        }]
});

orderSchema.pre('save', function(next) {
    var self = this;
    /*
     User.findOne( {owner: self.owner, status: {$ne : "done"}}, function(err, order) {
     if (err)
     return next(err);
     if (order)
     return next();
     done(new Error("An order is already open..."));
     });
     */
    next();
});