module.exports = function(async, Users, Message, FriendResult){
    return {
        setRouting: function(router){
            router.get('/settings/interest', this.getInterestPage);
            router.post('/settings/interest', this.postInterestPage);
        },
        getInterestPage: function(req, res){
            async.parallel([
                function(callback){
                    Users.findOne({'username': req.user.username})
                          .populate('request.userId')
                          .exec((err, result) => {
                              callback(err,result);
                          })
                },
                Message.aggregate({
                    {$match: {$or:[{'senderName':nameRegex},
                {'receiverName': nameRegex}]}},
                {$sort: {'createdAt': -1}},
                {
                    $group:{"_id":{
                        "last_message_between":{
                            $cond:[
                                {
                                    $gt:[
                                        {$substr:["$senderName", 0, 1]},
                                        {$substr:["$receiverName", 0, 1]}
                                    ]
                                },
                                    {$concat:["$senderName", " and ", "$receiverName"]},
                                    {$concat:["$receiverName", " and ", "$senderName"]}
                               
                            ]
                        },"body": {$first:"$$ROOT"}
                    }, function(err, newResult){
                        const arr = [
                            {path: 'body.sender', model: 'User'},
                            {path: 'body.receiver', model: 'User'}
                        ];
                        Message.populate(newResult, arr, (err, newResult1) => {
                            console.log(newResult1[0].body.sender)
                           callback(err, newResult1);
                        });
                    }} 
                }
                }),

            ], (err,results) => {
                const result1 = results[0];
                const result2 = results[1];
                
                res.render('user/interest', {title: 'Footballkik - Interest', user: req.user, data: result1, chat:result2});
            });
           
        },
        postInterestPage: function(req, res){
            FriendResult.PostRequest(req, res, '/settings/interest');
            async.parallel([
                function(callback){
                    if(req.body.favClub){
                        Users.update({
                            '_id':req.user._id,
                            'favClub.clubName': {$ne: req.body.favClub}
                        },{
                            $push: {favClub: {
                                clubName: req.body.favClub
                            }}
                        }, (err, results1) => {
                            callback(err, results1);
                        })
                    }
                },  
            ], (err, results) => {
                res.redirect('/settings/interest');
            });
            async.parallel([
                function(callback){
                    if(req.body.favPlayer){
                        Users.update({
                            '_id':req.user._id,
                            'favPlayer.playerName': {$ne: req.body.favPlayer}
                        },{
                            $push: {favPlayer: {
                                playerName: req.body.favPlayer
                            }}
                        }, (err, results2) => {
                            callback(err, results2);
                        })
                    }
                },  
            ], (err, results) => {
                res.redirect('/settings/interest');
            });
            async.parallel([
                function(callback){
                    if(req.body.nationalTeam){
                        Users.update({
                            '_id':req.user._id,
                            'favNationalTeam.teamName': {$ne: req.body.nationalTeam}
                        },{
                            $push: {favNationalTeam: {
                                teamName: req.body.nationalTeam
                            }}
                        }, (err, results3) => {
                            callback(err, results3);
                        })
                    }
                },  
            ], (err, results) => {
                res.redirect('/settings/interest');
            })
        }
    }
}

