var mongoose = require('mongoose');
//class schema
var ClassSchema = mongoose.Schema({
    title:
    {
        type: String
    },
    description:
    {
        type: String
    },
    instructor: {
        type: String
    },
    lessions: [{
        lession_number:
            { type: String },
        lession_title: {
            type: String
        },
        lession_body: {
            type: String
        }
    }]
});

var Class = module.exports = mongoose.model('Class', ClassSchema);

//fetch all classes
module.exports.getClasses = function (callback, limit) {
    Class.find(callback).limit(limit);
}

//fetch single classes
module.exports.getClassById = function (id, callback) {
    Class.findById(id, callback);
}