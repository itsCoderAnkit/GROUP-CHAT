const Sequelize = require('sequelize')
const sequelize = require('../util/database.js')

const Group = sequelize.define('groups', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    adminname: {
        type:Sequelize.STRING
       
    },
    groupname: {
        type: Sequelize.STRING
    },

})

module.exports = Group