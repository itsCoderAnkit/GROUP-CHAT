const Sequelize = require('sequelize')
const sequelize = require('../util/database.js')

const UserGroup = sequelize.define('usergroups',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    
})

module.exports = UserGroup