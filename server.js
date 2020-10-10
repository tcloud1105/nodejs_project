const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('flash');
const passport = require('passport');
const socketIO = require('socket.io');
const {Users} = require('./helpers/UsersClass');
const {Global} = require('./helpers/Global');
const compression = require('compression');
const helmet = require('helmet');

const container = require('./container');

container.resolve(function(users, _, admin, home, group, results, privatechat, profile, interest, news){
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/footballkik', {useMongoClient: true});

    const app = setupExpress();

    function setupExpress(){
        const app = express();
        const server = http.createServer(app);
        const io = socketIO(server);

        server.listen(3000, function(){
         console.log("Listening on port 3000");
        });
        confgureExpress(app);

        require('./socket/groupchat')(io, Users);
        require('./socket/friend')(io);
        require('./socket/globalroom')(io, Global, _);
        require('./socket/privatemessage')(io);
      // Setup router
        const router = require('express-promise-router')();
        users.setRouting(router);
        admin.setRouting(router);
        home.setRouting(router);
        group.setRouting(router);
        results.setRouting(router);
        privatechat.setRouting(router);
        profile.setRouting(router);
        interest.setRouting(router);
        news.setRouting(router);

        app.use(router);
        app.use(function(req, res){
            res.render('404');
        }); 
    }

    function confgureExpress(app){

        app.use(compression());
        app.use(helmet());
        
       require('./passport/passport-local');
       require('./passport/passport-facebook');
       require('./passport/passport-google');
      


        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));

        app.use(validator());
        app.use(session({
            secret: 'thisisasecretkey',
            resave: true,
            saveInitialized: true,
            store: new MongoStore({mongooseConnection: mongoose.connection})
        }));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
        app.locals._ = _;
    }
})