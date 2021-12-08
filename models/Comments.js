const {Schema,Types,model}=require('mongoose')

const schema =new Schema({
    article_id:{type:Types.ObjectId,ref:'Articles', required:true},
    user_id:{type:Types.ObjectId,ref:'Users',required:true},
    name: {type:String, required:true},
    body_text:{type:String, required:true},
    date_time:{type:Date, required:true}
},{versionKey:false})

module.exports = model('Comments',schema)