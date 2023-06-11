const Sequelize = require('sequelize')
const sequelize = require('../util/database.js')

const Message = sequelize.define('messages',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    message:{
        type:Sequelize.STRING
    },
    
})

module.exports = Message