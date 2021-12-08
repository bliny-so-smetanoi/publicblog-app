const {Schema,Types,model} = require('mongoose')

const schema = new Schema({
    user_id:{type:Types.ObjectId,ref:'Users', required:true},
    article_id:{type:Types.ObjectId,ref:'Articles',required:true}
}, {versionKey:false})

module.exports = model('Likes',schema)