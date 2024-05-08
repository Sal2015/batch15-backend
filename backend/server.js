const express = require ("express");
const mysql = require ('mysql');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());



const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    passsword: "",
    database: "innovesthub"
})
const pool = mysql.createPool({
    connectionLimit : 10,
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'innovesthub'
});



app.get('/startupdata', (req, res) => {
    const sql = "SELECT * FROM startup"; 
    db.query(sql, (err, data) => {
        if (err) {
            res.status(500).json({ error: "Failed to fetch data" });
        } else {
            res.json(data);
        }
    });
});

app.get('/productdata', (req, res) => {
    const sqlx = "SELECT * FROM product"; 
    db.query(sqlx, (err, data) => {
        if (err) {
            res.status(500).json({ error: "Failed to fetch data" });
        } else {
            res.json(data);
        }
    });
});


app.get('/data', (req, res) => {
    const sql = "SELECT * FROM user ORDER BY last_login_time DESC LIMIT 1;"; 
    db.query(sql, (err, data) => {
        if (err) {
            res.status(500).json({ error: "Failed to fetch data" });
        } else {
            res.json(data);
        }
    });
});




app.post('/signup', (req,res)=> {
    const sql = "INSERT INTO user (email,phone,password,dob,name) VALUES (?)";
    
    const values = [
        req.body.email,
        req.body.phone,
        req.body.password,
        req.body.dob,
        req.body.name
    ]
    db.query(sql,[values], (err,data) => {
        if(err) {
            return res.json("Error");
        }
        return res.json(data);
    })
})


app.post('/addstartup', (req,res)=> {
    const sqlt = "INSERT INTO startup (startup_name , startup_sector) VALUES (?)";
    
    const values = [
        req.body.startup_name,
        req.body.startup_sector,
        
    ]
    db.query(sqlt,[values], (err,data) => {
        if(err) {
            return res.json("Error");
        }
        return res.json(data);
    })
})

app.post('/addpro', (req,res)=> {
    const sql = "INSERT INTO product (product_name,product_phase,product_milestone,product_desc,patent_id,collaborator_name) VALUES (?)";
    
    const values = [
        req.body.product_name,
        req.body.product_phase,
        req.body.product_milestone,
        req.body.product_desc,
        req.body.patent_id,
        req.body.collaborator_name,
    ]
    db.query(sql,[values], (err,data) => {
        if(err) {
            return res.json("Error");
        }
        return res.json(data);
    })
})




app.post('/signin', (req,res)=> {
    const sql = "SELECT * FROM user WHERE email = ? AND password = ?";
    
   
    db.query(sql,[req.body.email, req.body.password], (err,data) => {
        if(err) {
            return res.json("Error");
        }
        if(data.length > 0){
            return res.json("Success");
        }
        else{
            return res.json("Failed");
        }
    })
})

app.get('/',(request,response) => {

    response.sendFile(__dirname + 'frontend/src/components/pages/app1.jsx');

});

app.get('/searchstartupdata',(request,response) => {

    const query = request.query.q;

    var sql = '';

    if(query != '')
	{
		sql = `SELECT * FROM startup WHERE startup_name LIKE '%${query}%'`;
	}
	else
	{
		sql = `SELECT * FROM startup ORDER BY startup_id`;
	}

	pool.query(sql, (error, results) => {

		if (error) throw error;

		response.send(results);

	});

});
app.get('/searchinnovatordata',(request,response) => {

    const query = request.query.q;

    var sql = '';

    if(query != '')
	{
		sql = `SELECT * FROM innovatorpro WHERE product_phase LIKE '%${query}%' OR innovator_name LIKE '%${query}%'`;
	}
	else
	{
		sql = `SELECT * FROM innovatorpro ORDER BY innovator_id`;
	}

	pool.query(sql, (error, results) => {

		if (error) throw error;

		response.send(results);

	});

});

var bodyParser = require('body-parser');
const socket = require("socket.io");
app.use(express.static('assets'));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors())

var server = app.listen(8082, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
});

app.get('/', function (req, res) {
  res.sendFile( __dirname +  "/" + '/frontend/src/components/pages/notificationex.js' );
});



const io = socket(server);
io.on("connection", function (socket) {
  console.log("Made socket connection");

  socket.on("disconnect", function () {
    console.log("Made socket disconnected");
  });

  socket.on("send-notification", function (data) {
    io.emit("new-notification", data);
  });

});




app.listen(8081, ()=> {
    console.log("connection with InnovestHub Server established")
})