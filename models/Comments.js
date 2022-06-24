const {Schema,Types,model} = require('mongoose')

const reply = new Schema({
    sender: {type: Types.ObjectId, required: true},
    body_text: {type: String, required: true},
    receiver: {type: Types.ObjectId, required: true},
    date_time: {type: Date, required: true}
})
const schema =new Schema({
    article_id:{type:Types.ObjectId,ref:'Articles', required:true},
    user_id:{type:Types.ObjectId,ref:'Users',required:true},
    name: {type:String, required:true},
    body_text:{type:String, required:true},
    date_time:{type:Date, required:true},
    replies: [reply]
},{versionKey:false})

module.exports = model('Comments',schema)