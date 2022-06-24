const Articles = require("../models/Articles");
const {Types} = require("mongoose");

async function fetchLikedByUser(isAuth, id, pageNumber, user, liked = true) {
    // try {
    //     return await fetchUsersArticles(isAuth, id, pageNumber, user, true, true)
    // } catch (e) {
    //     throw e
    // }
    try {
        let isLiked = false
        let expr = {'$eq': [Types.ObjectId(id), '$author']}
        //let isAuthorExpr = false

        if (isAuth) {
            isLiked = {
                '$cond': {
                    'if': {
                        '$in': [user, '$likes']
                    },
                    'then': true,
                    'else': false
                }

            }
        }

        if (liked) {
            expr = {'$in': [id, '$likes']}
        }

        // if (isAuthor) {
        //     isAuthorExpr = {'$toBool': {'$eq': ['$author', Types.ObjectId(id)]}}
        // }

        return await Articles.aggregate(
            [
                {'$match':
                        {'$expr':
                            expr
                        }
                },
                {
                    '$lookup': {
                        'from': 'users',
                        'localField': 'author',
                        'foreignField': '_id',
                        'pipeline': [{
                            '$project': {'first_name': 1, 'last_name': 1, '_id': 1, 'profile.image': 1}
                        }],
                        'as': 'user'
                    }
                },
                {
                    '$addFields': {
                        'isLiked': isLiked,
                        'likesCount': {
                            '$size': '$likes'
                        },
                        'isAuthor': {'$toBool': {'$eq': ['$author', Types.ObjectId(user)]}}
                    },
                },
                {
                    '$project': {
                        'likes': 0
                    }
                }
            ]
        ).sort({date_time: 'descending'}).skip(pageNumber * 3).limit(3)
    } catch (e) {
        throw e
    }
}

async function fetchOneArticle(id, userId) {
    try {
        const article = await Articles.aggregate([
            {'$lookup': {
                    'from': 'users',
                    'localField': 'author',
                    'foreignField': '_id',
                    'pipeline': [{
                        '$project': {'first_name': 1, 'last_name': 1, '_id': 1, 'profile.image': 1}
                    }],
                    'as': 'user'
                }},
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
                    },
                    'isAuthor': {
                        '$toBool': {'$eq': ['$author', Types.ObjectId(userId)]}
                    }
                }
            },
            {
                '$project': {
                    'likes': 0
                }
            }
        ])

        return article[0]
    } catch (e) {
        throw e
    }
}

async function fetchUsersArticles(isAuth, id, pageNumber, user, liked = false, isAuthor = false) {
    try {
        let isLiked = false
        let expr = {'$eq': [Types.ObjectId(user), '$author']}
        let isAuthorExpr = false

        if (isAuth) {
            isLiked = {
                '$cond': {
                    'if': {
                        '$in': [id, '$likes']
                    },
                    'then': true,
                    'else': false
                }

            }
        }

        if (liked) {
            expr = {'$in': [id, '$likes']}
        }

        if (isAuthor) {
            isAuthorExpr = {'$toBool': {'$eq': ['$author', Types.ObjectId(id)]}}
        }

        return await Articles.aggregate(
            [
                {'$match':
                        {'$expr':
                                expr
                        }
                },
                {
                    '$lookup': {
                        'from': 'users',
                        'localField': 'author',
                        'foreignField': '_id',
                        'pipeline': [{
                            '$project': {'first_name': 1, 'last_name': 1, '_id': 1, 'profile.image': 1}
                        }],
                        'as': 'user'
                    }
                },
                {
                    '$addFields': {
                        'isLiked': isLiked,
                        'likesCount': {
                            '$size': '$likes'
                        },
                        'isAuthor': {'$toBool': {'$eq': ['$author', Types.ObjectId(id)]}}
                    },
                },
                {
                    '$project': {
                        'likes': 0
                    }
                }
            ]
        ).sort({date_time: 'descending'}).skip(pageNumber * 3).limit(3)
    } catch (e) {
        throw e
    }
}

async function fetchArticles(isAuth, id, pageNumber) {
    try {
        let isLiked = false

        if (isAuth) {
            isLiked = {
                '$cond': {
                    'if': {
                        '$in': [id, '$likes']
                    },
                    'then': true,
                    'else': false
                }

            }
        }

        return await Articles.aggregate(
            [{
                '$lookup': {
                    'from': 'users',
                    'localField': 'author',
                    'foreignField': '_id',
                    'pipeline': [{
                        '$project': {'first_name': 1, 'last_name': 1, '_id': 1, 'profile.image': 1}
                    }],
                    'as': 'user'
                }
            },
                {
                    '$addFields': {
                        'isLiked': isLiked,
                        'likesCount': {
                            '$size': '$likes'
                        },
                        'isAuthor': {
                            '$toBool': {'$eq': ['$author', Types.ObjectId(id)]}
                        }
                    },
                },
                {
                    '$project': {
                        'likes': 0
                    }
                }
            ]
        ).sort({date_time: 'descending'}).skip(pageNumber * 3).limit(3)
    } catch (e) {
        throw e
    }

}

module.exports = {fetchArticles, fetchOneArticle, fetchUsersArticles, fetchLikedByUser}