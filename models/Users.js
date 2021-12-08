const {Schema, model} = require('mongoose')

const schema = new Schema({
    email: {type: String, required: true, unique:true},
    first_name:{type:String, required:true},
    last_name:{type:String, required:true},
    password:{type:String, required:true}
}, {versionKey: false})

module.exports = model('Users',schema)