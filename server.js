const express = require("express")
const cors = require("cors")
const bodyParser  = require("body-parser")
const mongoose = require("mongoose")
const passport = require("passport")

const {c, cpp, node, python, java} = require('compile-run');

var jsonParser = bodyParser.json()

const users = require("./Routes/api/users")
const db = require("./config/keys").mongoURI

const app = express()
app.use(cors())
app.use(express.json())
// app.use(
//     bodyParser.urlencoded({
//         extended:false
//     })
// );

// app.use(bodyParser.json())

mongoose.connect(
    db,
    {useNewUrlParser:true}
)
.then(()=>{
    console.log("MongoDB successfully connected")
})
.catch(err => console.log(err))

app.use(passport.initialize())
require("./config/passport")(passport)

app.use("/api/users",users)

app.post('/task', jsonParser,function(req, res) {
    console.log("Inside task")

    const sourcecode = req.body.desc
    const lang = req.body.lang_for_post
    const input_text = req.body.input_text

console.log(req.body);

    let resultPromise;

  if(lang==="python")
    resultPromise = python.runSource(sourcecode, { stdin: input_text});
  else if(lang==="c")
    resultPromise = c.runSource(sourcecode,{ stdin: input_text});
  else if(lang==="cpp")
    resultPromise = cpp.runSource(sourcecode,{ stdin: input_text});
  else if(lang==="java")
    resultPromise = java.runSource(sourcecode, { stdin: input_text});
  else;


    resultPromise
    .then(result => {
        console.log(result);
	res.send(result);
    })
    .catch(err => {
        console.log(err);
    });

   
})

app.listen(5000,()=>{
console.log("Server is up and running...")
})

