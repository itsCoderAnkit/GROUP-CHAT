const Sequelize = require('sequelize')
const sequelize = require('../util/database.js')

const ARCHIEVEDMessage = sequelize.define('archievedmessages',{
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

module.exports = ARCHIEVEDMessage