const {Router} = require('express')
const Articles = require('../models/Articles')
const Comments = require('../models/Comments')
const Users = require('../models/Users')
const {Types} = require("mongoose");
const router = Router()

// /api/articles/
router.get('/', async(req,res)=>{
    try{
        const id = req.get('Authorization').split(' ')[1]

        if (id !== 'undefined' || id !== undefined) {
            const articles = await Articles.aggregate(
                [
                    {
                        '$addFields': {
                            'isLiked': {
                                '$cond': {
                                    'if': {
                                        '$in': [id, '$likes']
                                    },
                                    'then': true,
                                    'else': false
                                }

                            },
                            'likesCount': {
                                '$size': '$likes'
                            }
                        },
                    },
                    {
                        '$project': {
                            'likes': 0
                        }
                    }
                ]
            ).sort({date_time: 'descending'})

            res.status(200).json(articles).end()

            return
        }

        if (id === undefined) {
            const articles = await Articles.aggregate(
                [
                    {
                        '$addFields': {
                            'isLiked': false
                            ,
                            'likesCount': {
                                '$size': '$likes'
                            }
                        },
                    },
                    {
                        '$project': {
                            'likes': 0
                        }
                    }
                ]
            ).sort({date_time: 'descending'})

            res.status(200).json(articles).end()

            return
        }

        const articles = await Articles.find({}).sort({date_time: 'descending'})

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
            likes: new Array(0)
        })

        await newArticle.save()

        res.status(200).json({message: 'New article successfully created!'})
    }catch (e){
        res.status(500).json({message:'Unable to create article'})
    }
})

// /api/articles/:id
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const userId = req.get('Authorization').split(' ')[1]

        const response = await Articles.aggregate([
            {
                '$match': {
                    '$expr': {
                        '$eq': [
                            '$_id',
                            {'$toObjectId': id}
                        ]
                    }
                }
            },
            {
                '$addFields': {
                    'likesCount': {
                        '$size': '$likes'
                    },
                    'isLiked': {
                        '$cond': {
                            'if': {
                                '$in': [userId, '$likes']
                            },
                            'then': true,
                            'else': false
                        }

                    }
                }
            },
            {
                '$project': {
                    'likes': 0
                }
            }
        ])
        res.status(200).json(response[0])

    } catch (e) {
        res.status(500).json({message:'Unable to fetch article'})
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

// /api/articles/like
router.post('/like', async (req, res) => {
    try {
        const id = req.body.id
        const userId = req.body.userId
        if (userId === undefined) {
            res.status(401).json({message: 'Unauth'})
        }

        const result = await Articles.findByIdAndUpdate(id, {
            '$push': {'likes': userId}
        })

        const likesCount = await Articles.aggregate([
            {
                '$match': {
                    '$expr': {
                        '$eq': [
                            '$_id',
                            {'$toObjectId': id}
                        ]
                    }
                }
            },
            {
                '$addFields': {
                    'likesCount': {
                        '$size': '$likes'
                    }
                }
            },
            {
                '$project': {
                    'likesCount': 1
                }
            }
        ])

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
            res.status(401).json({message: 'Unauth'})
        }
        const result = await Articles.findByIdAndUpdate(id, {
            '$pull': {'likes': userId}
        })
        const likesCount = await Articles.aggregate([
            {
                '$match': {
                    '$expr': {
                        '$eq': [
                            '$_id',
                            {'$toObjectId': id}
                        ]
                    }
                }
            },
            {
                '$addFields': {
                    'likesCount': {
                        '$size': '$likes'
                    }
                }
            },
        ])

        res.status(201).json({message: 'Unliked', likesCount})

    } catch (e) {
        res.status(500).json({message:'Unable to unlike post'})
    }
})

module.exports = router