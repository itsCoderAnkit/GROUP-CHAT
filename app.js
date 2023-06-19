const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
const http = require('http')
var cors = require('cors')
const io = require('socket.io')(3000,{cors:{
    origin:['http://localhost:8000']
}});

const usersignup = require('./router/user.js')
const userchats = require('./router/chat.js')
const group = require('./router/group.js')
const groupmessages = require('./router/groupmessages.js')


const User = require('./model/user_signup.js')
const Message = require('./model/message.js')
const Group = require('./model/groups.js')
const UserGroup = require('./model/usergroup.js')

const dotenv = require('dotenv')
dotenv.config()

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

//const io = socketio(8080); 

// const server = http.createServer(app);   // create a server instance
// const io = socketio(server);
const sequelize = require('./util/database')

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

const users = {}

io.on('connection', (socket) => {
    console.log('user connected>>>', socket.id);

    socket.on('login', username=> {
        users[socket.id] = username
        console.log(users)
        console.log('logged in :', username);
        //socket.join(groupId);
    });

    socket.on('message', (msg,users) => {

        // console.log('groupId :', msg.groupId);
        // console.log('Received message:', msg.message);
        // io.to(msg.groupId).emit('receivedMsg', msg);

        console.log("message event>> ",msg , users)
        io.emit('print-message',msg,users)
    });

    socket.on('new-message',(msg,user)=>{
        console.log("new msg and user>>",msg,user)
        io.emit('print-new-message',msg,user)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
})


app.use(bodyParser.json())
app.use(express.urlencoded({extended:false}))



User.hasMany(Message)
Message.belongsTo(User)

Group.hasMany(Message)
Message.belongsTo(Group)

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });



app.use(express.static('views'));

app.use(usersignup)
app.use(userchats)
app.use(group)
app.use(groupmessages)
app.use(upload.single('myfile'),userchats);


sequelize
    .sync()
    //.sync({force:true})
    .then(result => {
        console.log("IT IS APP.JS RESULT")
        //console.log(result)
        app.listen(8000)
        //server.listen(8000)
       
    })
    .catch(err => {
        console.log("IT IS APP.JS CATCH ERROR")
        console.log(err)
    })