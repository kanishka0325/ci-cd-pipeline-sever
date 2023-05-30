const mongoose = require('mongoose');
const { Schema, model} = mongoose;

const TypeSchema = new Schema({
    type: {type: String, required: true},
});

const TypeModel = model('Type', TypeSchema);
module.exports = TypeModel;