const {Router} = require('express')
const Articles = require('../models/Articles')
const Comments = require('../models/Comments')
const Users = require('../models/Users')
const {Types} = require("mongoose");
const router = Router()

// /api/articles/
router.get('/', async(req,res)=>{
    try{
        const articles = await Articles.find(null).sort({date_time: 'descending'})

        res.status(200).json(articles)

    }catch (e){
        console.error(e.message)
        res.status(500).json({message: 'Cannot process request, unable to get articles.'})
    }
})

// /api/articles/create
router.post('/create', async(req,res)=>{
    try{
        const {author, title, body_text} = req.body

        const {first_name, last_name} = await Users.findOne({_id:author},'first_name last_name')
        const name = `${first_name} ${last_name}`
        const date_time = Date.now()

        const newArticle = new Articles({
            author,
            name,
            title,
            body_text,
            date_time
        })

        await newArticle.save()

        res.status(200).json({message: 'New article successfully created!'})
    }catch (e){
        res.status(500).json({message:'Unable to create article'})
    }
})

// /api/articles/comments/:id
router.get('/comments/:id', async(req,res)=>{
    try{
        const id = req.params.id

        const comments = await Comments.find({article_id: id}).sort({date_time: 'ascending'})

        res.status(200).json(comments)

    }catch (e){
        res.status(500).json({message:'Cannot process request, comments will not be displayed.'})
    }
})

// /api/articles/comments/create
router.post('/comments/create', async(req,res)=>{
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

module.exports = router