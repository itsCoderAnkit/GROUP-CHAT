const path = require('path')
const Users = require('../model/user_signup')
const Message = require('../model/message')
const Group = require('../model/groups')
const UserGroup = require('../model/usergroup')

exports.get_group_messages = async (req,res,next)=>{
    try{
        console.log("get group messages")
        await res.sendFile(path.join(__dirname, "../", "views", "getgroupmessages.html"))
    }
    catch(err){
        console.log(err)
    }
}

exports.get_group_chat = async (req,res,next)=>{
    try{
        userId = req.user.id
        groupId = req.params.groupId

        console.log("user and group details", userId , groupId)

        const groupMessages = await Message.findAll({ where: { groupId:groupId} })
        console.log("groupmessages>>.",groupMessages)

        const groupMembers = await UserGroup.findAll({where:{groupId:groupId}})
        console.log("groupmembers>>.",groupMembers)
        groupmembersarray = []
        for(let i=0;i<groupMembers.length;i++){
            console.log(groupMembers[i].dataValues.userId)
            const relevantUsers = await Users.findAll({where:{id:groupMembers[i].dataValues.userId}})
            console.log("relevant users>>",relevantUsers)
            groupmembersarray.push(relevantUsers[0].dataValues)
        }

        console.log("array>>",groupmembersarray)
        return res.status(200).json({ success: true, groupMessages: groupMessages, groupMembers:groupmembersarray })

    }
    catch(err){
        console.log(err)
    }
}