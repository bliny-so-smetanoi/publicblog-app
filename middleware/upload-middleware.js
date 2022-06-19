const multer = require('multer')
const {GridFsStorage} = require('multer-gridfs-storage')
const util = require("util");
const config = require('config')

const storage = new GridFsStorage({
    url: config.get('mongoUri'),
    options: {useNewUrlParser: true, useUnifiedTopology: true},
    file: (req, file) => {
        const match = ['image/png', 'image/jpeg', 'image/gif']

        if(match.indexOf(file.mimetype) === -1) {
            return `${Date.now()}-publicblogapp-${file.originalname}`
        }

        return {
            bucketName: 'photos',
            filename: `${Date.now()}-publicblogapp-${file.originalname}`
        }
    }
})

const uploadFiles = multer( {storage} ).single('file')
const uploadFilesMiddleware = util.promisify(uploadFiles)

module.exports = uploadFilesMiddleware