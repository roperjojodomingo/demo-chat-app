var express = require('express')
// to read the body of request in post
var bodyParser = require('body-parser')
var app = express()

// create a regular http server 
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// mongoDB database URI
var dbUrl = ""

var Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.get('/messages', (req, res)=>{
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

app.post('/messages', async(req, res)=>{
    try {
        var message = new Message(req.body)
        var savedMessage = await message.save()

        io.emit('message', req.body)
        res.sendStatus(200)
    } catch (error) {
        sendStatus(500) 
        console.log(error)
    }
})

io.on('connection', (socket) => {

})

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true}, (err) =>{
    console.log(err)
})
var server = http.listen(3000, () => {
    console.log("Server is listening to port", server.address().port)
})