const {Schema, model,Types} = require('mongoose')

const schema = new Schema({
    author: {type: Types.ObjectId,ref:'Users', required:true},
    name: {type: String, required:true},
    title: {type: String, required: true},
    body_text: {type: String, required: true},
    likes: {type: Number},
    date_time: {type: Date, required: true}
}, {versionKey: false})

module.exports = model('Articles', schema)