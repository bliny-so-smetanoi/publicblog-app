const Comments = require("../models/Comments");
const {Types} = require("mongoose");

async function fetchOneOrAllComments(id, one = false) {
    try {
        let searchId = '$article_id'
        if (one) {
            searchId = '$_id'
        }

        return await Comments.aggregate([
            {
                '$match': {
                    '$expr':
                        {'$eq': [Types.ObjectId(id), searchId]}
                }
            },
            {
                '$unwind':
                    {
                        path: '$replies',
                        preserveNullAndEmptyArrays: true
                    }
            },
            {
                '$lookup': {
                    from: 'users',
                    localField: 'replies.sender',
                    foreignField: '_id',
                    'pipeline': [
                        {'$project': {'first_name': 1, 'last_name': 1, '_id': 1, 'profile.image': 1}}
                    ],
                    as: 'replies.sender'
                }
            },
            {
                '$unwind': {
                    path: '$replies.sender',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                '$group': {
                    '_id': '$_id',
                    'replies': {
                        '$push': '$replies'
                    }
                }
            },
            {
                '$lookup': {
                    from: 'comments',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'commentDetails'
                }
            },
            {
                '$unwind': {
                    path: '$commentDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                '$addFields': {
                    'commentDetails.replies': '$replies'
                }
            },
            {
                '$replaceRoot': {
                    'newRoot': '$commentDetails'
                }
            },
            {
                '$unwind':
                    {
                        path: '$replies',
                        preserveNullAndEmptyArrays: true
                    }
            },
            {
                '$lookup': {
                    from: 'users',
                    localField: 'replies.receiver',
                    foreignField: '_id',
                    'pipeline': [
                        {'$project': {'first_name': 1, 'last_name': 1, '_id': 1, 'profile.image': 1}}
                    ],
                    as: 'replies.receiver'
                }
            },
            {
                '$unwind': {
                    path: '$replies.receiver',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                '$group': {
                    '_id': '$_id',
                    'replies': {
                        '$push': '$replies'
                    }
                }
            },
            {
                '$lookup': {
                    from: 'comments',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'commentDetails'
                }
            },
            {
                '$unwind': {
                    path: '$commentDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                '$addFields': {
                    'commentDetails.replies': '$replies'
                }
            },
            {
                '$replaceRoot': {
                    'newRoot': '$commentDetails'
                }
            },
            {
                '$lookup': {
                    'from': 'users',
                    'localField': 'user_id',
                    'foreignField': '_id',
                    'pipeline': [
                        {'$project': {'first_name': 1, 'last_name': 1, '_id': 1, 'profile.image': 1}}
                    ],
                    'as': 'user'
                }
            },
            {
                '$unwind': {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                },
            },
        ]).sort({'date_time': 'ascending'})
    } catch (e) {
        throw e
    }

}

module.exports = {fetchOneOrAllComments}