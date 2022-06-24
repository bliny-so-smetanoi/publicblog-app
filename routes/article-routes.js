const {Router} = require('express')
const Articles = require('../models/Articles')
const Comments = require('../models/Comments')
const Users = require('../models/Users')
const {Types} = require("mongoose");
const {dislike, like} = require("../services/like-service");
const {fetchArticles, fetchOneArticle, fetchUsersArticles, fetchLikedByUser} = require("../services/articles-service");
const {fetchOneOrAllComments} = require("../services/comments-service");
const deleteFile = require("../services/files-service");
const router = Router()

// /api/articles/get/:page
router.get('/get/:page', async(req,res)=>{
    try{
        const pageNumber = +req.params.page
        const id = req.get('Authorization').split(' ')[1]

        if (id !== 'undefined' || id !== undefined) {
            const articles = await fetchArticles(true, id, pageNumber)

            return res.status(200).json(articles).end()
        }

        const articles = await fetchArticles(false, id, pageNumber)

        return res.status(200).json(articles).end()

    }catch (e){
        console.error(e.message)
        res.status(500).json({message: 'Cannot process request, unable to get articles.'})
    }
})

// /api/articles/profile/:id
router.get('/profile/:id', async (req, res) => {
    try {
        const userId = req.params.id
        const userInfo = await Users.findById(userId, 'first_name last_name profile')

        return res.status(200).json(userInfo)
    } catch (e) {
        res.status(500).json({message: 'Cannot get user\'s info'})
    }
})

// /api/articles/liked
router.get('/liked/', async (req, res) => {
    try {
        const id = req.query.id
        const page = req.query.page
        const userId = req.get('Authorization').split(' ')[1]

        if (userId !== undefined) {
            const likedArticles = await fetchLikedByUser(true, id, page, userId)
            return res.status(200).json(likedArticles)
        }

        const likedArticles = await fetchLikedByUser(false, id, page, userId)
        return res.status(200).json(likedArticles)

    } catch (e) {
        console.log(e)
        res.status(500).json({message: 'Cannot get liked articles'})
    }
})

// /api/articles/user/?id&page
router.get('/user/', async (req, res) => {
    try {
        const id = req.query.id
        const page = req.query.page

        const userId = req.get('Authorization').split(' ')[1]

        if (userId !== undefined) {
            const articles = await fetchUsersArticles(true, userId, page, id)
            return res.status(200).json(articles)
        }

        const articles = await fetchUsersArticles(false, userId, page, id)
        return res.status(200).json(articles)


    } catch (e) {
        res.status(500).json({message: 'Cannot get user\'s articles'})
    }
})

// /api/articles/create
router.post('/create', async(req,res)=>{
    try{
        const {author, title, body_text, image} = req.body
        if(title === '' || body_text === '') {
            res.status(500).json({message: 'Title or body is empty'})
            return
        }
        const {first_name, last_name} = await Users.findOne({_id:author},'first_name last_name')
        const name = `${first_name} ${last_name}`
        const date_time = Date.now()

        const newArticle = new Articles({
            author,
            name,
            title,
            body_text,
            date_time,
            likes: new Array(0),
            image
        })

        await newArticle.save()

        res.status(200).json({message: 'New article successfully created!'})
    }catch (e){
        res.status(500).json({message:'Unable to create article'})
    }
})
// /api/articles/delete/:id
router.delete('/delete/:id', async(req, res) => {
    try {
        const articleId = req.params.id

        const deletedArticle = await Articles.findByIdAndDelete(articleId)

        if (deletedArticle.image !== undefined) {
            await deleteFile(deletedArticle.image)
        }

        return res.status(200).json({message: 'Deleted'})
    } catch (e) {
        console.log(e)
        res.status(500).json({message: 'Cannot delete post'})
    }
})
// /api/articles/:id
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const userId = req.get('Authorization').split(' ')[1]

        const response = await fetchOneArticle(id, userId)

        res.status(200).json(response)

    } catch (e) {
        res.status(500).json({message:'Unable to fetch article'})
    }
})

// /api/articles/like
router.post('/like', async (req, res) => {
    try {
        const id = req.body.id
        const userId = req.body.userId

        if (userId === undefined) {
            res.status(401).json({message: 'Unauthorized'})
        }

        const likesCount = await like(id, userId)

        res.status(201).json({message: 'Liked', likesCount})

    } catch (e) {
        res.status(500).json({message:'Unable to like post'})
    }
})

// /api/articles/like
router.delete('/like', async (req, res) => {
    try {
        const id = req.body.id
        const userId = req.body.userId
        if (userId === undefined) {
            res.status(401).json({message: 'Unauthorized'})
        }

        const likesCount = await dislike(id, userId)

        res.status(201).json({message: 'Unliked', likesCount})

    } catch (e) {
        res.status(500).json({message:'Unable to unlike post'})
    }
})

// /api/articles/edit
router.put('/edit', async (req, res) => {
    try {
        const {body_text, title, articleId} = req.body

        await Articles.findByIdAndUpdate(articleId, {'$set': {'body_text': body_text,
                'title': title, 'edited': true}})

        return res.status(200).json({message: 'Edited'})
    } catch (e) {
        res.status(500).json({message: 'Cannot edit'})
    }
})

module.exports = router