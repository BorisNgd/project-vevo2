const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/userRoutes')
const cors = require('cors');
const app = express();
const port = process.event.PORT;
const mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname,'public')));
// app.use('/static',express.static('monDossier')); 

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.get('/', (req, res) => res.render('home' , {title : 'HOME PAGE'}));
app.get('/login', (req, res) => res.render('login' , {title : 'LOGIN PAGE' , message : req.param.message}));
app.get('/register', (req , res) => res.render('register' , {title : 'REGISTER PAGE' }));
app.get('/logout' , (req ,res) => { res.redirect('/login') });
app.get('/dashboard' , (req , res) =>{ res.render('dashboard' , {name : req.body.login}) });

var options = {useNewUrlParser:true , useUnifiedTopology: true , useCreateIndex:true};


mongoose.connect('mongodb://boris:boris123@clusterboris-shard-00-00-o9aqv.mongodb.net:27017,clusterboris-shard-00-01-o9aqv.mongodb.net:27017,clusterboris-shard-00-02-o9aqv.mongodb.net:27017/test?ssl=true&replicaSet=ClusterBoris-shard-0&authSource=admin&retryWrites=true&w=majority',options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Connected to database')
});
(require('./routes'))(app)

app.listen(port, () => console.log(`Server Running on port ${port} `));