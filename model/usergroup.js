const Sequelize = require('sequelize')
const sequelize = require('../util/database.js')

const UserGroup = sequelize.define('usergroups',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    isAdmin:{
        type: Sequelize.BOOLEAN
    }
    
})

module.exports = UserGroup