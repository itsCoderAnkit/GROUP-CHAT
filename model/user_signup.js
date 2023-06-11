const Sequelize = require('sequelize')
const sequelize = require('../util/database.js')

const User = sequelize.define('users',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING
    },
    email:{
        type:Sequelize.STRING,
        //allowNull:false
    },
    phone:{
        type:Sequelize.STRING,
        
    },
    password:{
        type:Sequelize.STRING
    },
    isactive:{
        type:Sequelize.BOOLEAN
    }
})

module.exports = User