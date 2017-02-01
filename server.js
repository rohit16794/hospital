var express  = require('express');
    var app      = express();                              
    var mongoose = require('mongoose');                    
    var morgan = require('morgan');             
    var bodyParser = require('body-parser');    
    var methodOverride = require('method-override'); 

    // configuration =================
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/hospital');     

    app.use(express.static(__dirname + '/public'));                 
    app.use(morgan('dev'));                                         
    app.use(bodyParser.urlencoded({'extended':'true'}));            
    app.use(bodyParser.json());                                     
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
    app.use(methodOverride());
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    var RegisterSchema = new mongoose.Schema ({
        firstname : {
            type: String
            //required:true
        },
        lastname : {
            type: String
            //required:true
        },
        age:{
            type:Number
            //required:true
        },
        dob:{
            type:String
           // required:true
        },
        gender:{
            type:String,
            enum:['Default','Male','Female']
            //required:true
        },
        phone:{
              type:Number
              //required:true  
        },
        info:{
            type:String
        }

    })
    var Register = mongoose.model('patients',RegisterSchema );


   
    app.post('/', function(req, res) {
        new Register({
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            age : req.body.age,
            dob : req.body.dob,
            gender : req.body.gender,
            phone : req.body.phone,
            info : req.body.info
        }).save(function(err,doc){
            if(err) console.log(err);
            else res.send('Successfully submitted!');
        })

        });
        app.get('/patients',function(req,res){
            Register.find({},function(err,docs){
               res.render('display.jade',{members:docs})
            })
        })

 app.get('/search',function(req,res){
            //console.log("rohit");
            res.sendfile('./views/search.html')
            /*Register.find({},function(err,docs){
                res.render('display.jade',{members:docs})*/
            })

app.post('/search',function(req,res){
             fname= req.body.firstname;
             lname= req.body.lastname;
             console.log(fname);
             Register.find({$and:[{firstname:fname},{lastname:lname}]},function(err,docs){
                res.render('display.jade',{members:docs})
        })
         })

    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); 
    });
   
    app.listen(3000);
    console.log("App listening on port 3000");
