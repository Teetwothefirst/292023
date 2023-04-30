const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const pg = require("pg");
require("dotenv").config();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({origin: "*"}));
app.use((req, res, next)=> {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    next();
});

//postgres://hvqmihmh:AoCIxddRL_UrC4Adbdj0b8YU8rDvFCHr@surus.db.elephantsql.com/hvqmihmh
//postgres://postgres:Caterpillar@localhost/smartlock
// DATABASE CONNECTION
const localContring = "postgres://hvqmihmh:AoCIxddRL_UrC4Adbdj0b8YU8rDvFCHr@surus.db.elephantsql.com/hvqmihmh";
const client = new pg.Client(localContring);
client.connect(async function (err) {
    if (err) {
        return console.error("could not connect to database", err);
    }
    console.log("Connected to database");
});

// SALT
const salt = bcrypt.genSaltSync(10)

// ROUTES
app.post("/signup", (req, res)=>{
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password

    const hashedPassword = bcrypt.hashSync(password, salt, '$2a$10$CwTycUXWue0Thq9StjUM0u');
    const text = 'INSERT INTO users(email, firstname, lastname, password_) VALUES($1, $2, $3, $4)'
    const values = [email, firstName, lastName, hashedPassword]
    client.query(text, values)
    .then(response => {
        return res.send({result: 1});
    }).catch(err => {
        console.log(err);
        return res.send({error: err, result: 0});
    })
});

app.post("/login", (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    client.query(`SELECT * FROM users where email = '${email}'`).then(result => {
        if (result.rowCount > 0) {
            bcrypt.compare(password.trim(), result.rows[0].password_, (err, isMatch) => {
                if(isMatch){
                    return res.status(200).send({ result: 1, response: result});
                }else{
                    return res.status(200).send({ result: 2});
                }
            });
        }else{
            return res.status(200).send({ result: 0});
        }
    }).catch(err => console.error(err));
});

app.post("/door", (req, res)=>{
    const door = req.body.door;
    const email = req.body.email;
    console.log(door + " " + email)
    const text = 'update users set door=$1 where email=$2';
    const values = [door, email];
    client.query(text, values)
    .then(response => {
        return res.send({result: 1});
    }).catch(err => {
        console.log(err);
        return res.send({error: err, result: 0});
    })
});

// PORT
app.set("port", process.env.PORT || 8000);
app.listen(app.get("port"), ()=>{
    console.log("Server is running on port " + app.get("port"))
})