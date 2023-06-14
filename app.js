const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
var cors = require('cors')

const usersignup = require('./router/user.js')
const userchats = require('./router/chat.js')
const group = require('./router/group.js')
const groupmessages = require('./router/groupmessages.js')

const User = require('./model/user_signup.js')
const Message = require('./model/message.js')
const Group = require('./model/groups.js')
const UserGroup = require('./model/usergroup.js')

const dotenv = require('dotenv')

const sequelize = require('./util/database')

app.use(cors({
    origin:"*",
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}))

app.use(bodyParser.json())

dotenv.config()

User.hasMany(Message)
Message.belongsTo(User)

Group.hasMany(Message)
Message.belongsTo(Group)

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

app.use(usersignup)
app.use(userchats)
app.use(group)
app.use(groupmessages)

sequelize
.sync()
//.sync({force:true})
.then(result =>{
    console.log("IT IS APP.JS RESULT")
    //console.log(result)
    app.listen(8000)
})
.catch( err =>{
    console.log("IT IS APP.JS CATCH ERROR")
    console.log(err)
})