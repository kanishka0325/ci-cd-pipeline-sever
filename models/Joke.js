const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const JokeSchema = new Schema({
    joke: {type: String, required: true},
    status: {type: String, required: true},
    type: {type: Schema.Types.ObjectId, ref: 'Type'}
}, {
    timestamps: true,
});

const JokeModel = model('Joke', JokeSchema);
module.exports = JokeModel;