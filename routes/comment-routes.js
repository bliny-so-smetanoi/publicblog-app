const {Router} = require('express')
const {fetchOneOrAllComments} = require("../services/comments-service");
const Users = require("../models/Users");
const Comments = require("../models/Comments");

const router = Router()

// /api/articles/comments/:id
router.get('/:id', async(req,res)=>{
    try{
        const id = req.params.id
        const comments = await fetchOneOrAllComments(id)

        res.status(200).json(comments)

    }catch (e){
        console.log(e)
        res.status(500).json({message:'Cannot process request, comments will not be displayed.'})
    }
})

// /api/articles/comments/create
router.post('/create', async(req,res)=>{
    try{
        const {article_id, user_id, body_text} = req.body

        const {first_name, last_name} = await Users.findOne({_id:user_id},'first_name last_name')
        const name = `${first_name} ${last_name}`

        const date_time = Date.now()

        const newComment = new Comments({
            article_id,
            user_id,
            name,
            body_text,
            date_time
        })

        await newComment.save()

        res.status(200).json({message:'New comment added successfully!'})

    }catch (e){
        res.status(500).json({message:'Unable to post comment'})
    }
})

// /api/articles/comments/reply
router.post('/reply', async(req,res)=>{
    try{
        const {commentId, user, body_text, receiver} = req.body

        const replyObject = {
            sender: user,
            body_text,
            receiver,
            date_time: Date.now()
        }

        await Comments.findByIdAndUpdate(commentId, {'$push': {'replies': replyObject}})

        return res.status(201).json({message: 'Replied'})
    }catch (e){
        res.status(500).json({message: 'Cannot send reply'})
    }
})

// /api/articles/comments/comment/:id
router.get('/comment/:id', async(req, res)=> {
    try{
        const id = req.params.id
        const comment = await fetchOneOrAllComments(id, true)

        return res.status(200).json(comment[0])
    }catch (e) {
        res.status(500).json({message: 'Cannot load comment'})
    }
})

module.exports = router