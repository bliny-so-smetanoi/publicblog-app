const Articles = require("../models/Articles");

async function like(id, userId) {
    try {
        const result = await Articles.findByIdAndUpdate(id, {
            '$push': {'likes': userId}
        })

        return await getLikesCount(id)
    } catch (e) {
        throw e
    }

}

async function getLikesCount(id) {
    try {
        return await Articles.aggregate([
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
    } catch (e) {
        throw e
    }

}

async function dislike(id, userId) {
    try {
        const result = await Articles.findByIdAndUpdate(id, {
            '$pull': {'likes': userId}
        })

        return await getLikesCount(id)
    } catch (e) {
        throw e
    }

}

module.exports = {dislike, like}