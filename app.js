const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
const http = require('http')
var cors = require('cors')
const cron = require('node-cron')
const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:8000']
    }
});

const usersignup = require('./router/user.js')
const userchats = require('./router/chat.js')
const group = require('./router/group.js')
const groupmessages = require('./router/groupmessages.js')
const fileupload = require('./router/files.js')


const User = require('./model/user_signup.js')
const Message = require('./model/message.js')
const Group = require('./model/groups.js')
const UserGroup = require('./model/usergroup.js')
const ArchievedMessage = require('./model/archievedMessage.js')

const dotenv = require('dotenv')
dotenv.config()

const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()} - ${file.originalname}`)
    }
})

const upload = multer({ storage: storage })
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

    socket.on('login', username => {
        users[socket.id] = username
        console.log(users)
        console.log('logged in :', username);
        //socket.join(groupId);
    });

    socket.on('message', (msg, users) => {

        // console.log('groupId :', msg.groupId);
        // console.log('Received message:', msg.message);
        // io.to(msg.groupId).emit('receivedMsg', msg);

        console.log("message event>> ", msg, users)
        io.emit('print-message', msg, users)
    });

    socket.on('new-message', (msg, user) => {
        console.log("new msg and user>>", msg, user)
        io.emit('print-new-message', msg, user)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
})


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



User.hasMany(Message)
Message.belongsTo(User)

Group.hasMany(Message)
Message.belongsTo(Group)

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

User.hasMany(ArchievedMessage);
ArchievedMessage.belongsTo(User)

Group.hasMany(ArchievedMessage);
ArchievedMessage.belongsTo(Group)

app.use(express.static('views'));

app.use(usersignup)
app.use(userchats)
app.use(group)
app.use(groupmessages)
app.use(upload.single('myfile'), fileupload);


cron.schedule('0 0 * * *', async () => {
    try {

        const chats = await Message.findAll();
        console.log('ALL CHAT>>.', chats);

        for (const chat of chats) {
            await ArchievedMessage.create({ groupId: chat.groupId, userId: chat.userId, message: chat.message });
            console.log('CHAT ID', chat.id)
            await Message.destroy({ where: { id: chat.id } })
        }

        console.log('CRON IS RUNNING');
    } catch (err) {
        console.error(err);
    }
})

sequelize
    .sync()
    //.sync({ force: true })
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