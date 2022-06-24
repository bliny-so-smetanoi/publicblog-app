const {Schema, model} = require('mongoose')

const profile = new Schema({
    image: {type: String, default: '1656063389951-publicblogapp-nopicprofile.jpg'},
    description: {type: String, default: ''}
})

const schema = new Schema({
    email: {type: String, required: true, unique:true},
    first_name:{type:String, required:true},
    last_name:{type:String, required:true},
    password:{type:String, required:true},
    profile: profile
}, {versionKey: false})

module.exports = model('Users',schema)