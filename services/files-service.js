const {MongoClient} = require("mongodb");
const config = require("config");

async function deleteFile(filename) {
    try {
        const mongoClient = new MongoClient(config.get('mongoUri'))

        await mongoClient.connect()
        const database = mongoClient.db('publicblogapp')

        const photoFiles = database.collection('photos.files')
        const photoChunks = database.collection('photos.chunks')

        const file = await photoFiles.findOne({'filename': filename})
        const deleteChunks = await photoChunks.deleteMany({'files_id': file._id})

        const deleteFile = await photoFiles.deleteOne({'filename': filename})

    } catch (e) {
        throw e
    }
}

module.exports = deleteFile