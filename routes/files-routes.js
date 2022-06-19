const {Router} = require('express')
const upload = require('../middleware/upload-middleware')
const router = Router()
const MongoClient = require('mongodb').MongoClient
const GridFSBucket = require('mongodb').GridFSBucket
const config = require('config')

// /api/files/upload
router.post('/upload',async (req, res) => {
    try {
        await upload(req, res)

        if(req.file === undefined) {
            return res.status(400).json({message: 'Select file'})
        }

        const filename = req.file.filename

        res.status(200).json({message: 'Uploaded', filename})
    }catch (e){
        console.log(e)
        res.status(500).json({message: 'Unable to upload'})
    }
})

// /api/files/download/:name
router.get('/download/:name', async (req, res) => {
    try {
        const mongoClient = new MongoClient(config.get('mongoUri'))

        await mongoClient.connect()
        const database = mongoClient.db('publicblogapp')
        const bucket = new GridFSBucket(database, {
            bucketName: 'photos'
        })

        const downloadStream = bucket.openDownloadStreamByName(req.params.name)

        downloadStream.on('data', data => {
            return res.status(200).write(data)
        })

        downloadStream.on('error', err => {
            return res.status(404).send({message: 'Cannot download the image'})
        })

        downloadStream.on('end', () => {
            return res.end()
        })

    } catch (e) {
        res.status(500).json({message: 'Error'})
    }
})

module.exports = router