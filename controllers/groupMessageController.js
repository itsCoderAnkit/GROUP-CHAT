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
       let groupmembersarray = []
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

exports.get_group_members = async (req,res,next) =>{
    try{

        userId = req.user.id
        groupId = req.params.groupId

        isAdmin = await UserGroup.findAll({where:{userId:req.user.id,groupId:groupId}})

        console.log("isAdmin>>",isAdmin[0].dataValues.isAdmin)

        const groupMembers = await UserGroup.findAll({where:{groupId:groupId}})
        //console.log("groupmembers>>.",groupMembers)
        let groupmembersarray = [] 
        for(let i=0;i<groupMembers.length;i++){
            console.log(groupMembers[i].dataValues.userId)
            const relevantUsers = await Users.findAll({where:{id:groupMembers[i].dataValues.userId}})
            console.log("relevant users>>",relevantUsers)
            groupmembersarray.push(relevantUsers[0].dataValues)
        } 
        console.log("array>>",groupmembersarray)

        if(isAdmin[0].dataValues.isAdmin){
            console.log("ye admin hai")
            return res.status(200).json({ isAdmin: true,  groupMembers:groupmembersarray })    
        }
        else{
            console.log("ye admin nai hai")
            return res.status(200).json({ isAdmin: false,  groupMembers:groupmembersarray })
        }
        
    }
    catch(err){
        console.log(err)
    }
}

exports.change_admin = async (req,res,next ) =>{
    try{
        console.log("inside change admin")
        console.log(req.params.groupId,req.params.userId)
        
        const new_admin = await UserGroup.update({isAdmin:true},{where:{userId:req.params.userId,groupId:req.params.groupId}})
        const admin_name = await Users.findAll({where:{id:req.params.userId}})
        console.log("admin name > ",admin_name[0].dataValues.name)
        return res.status(200).json({ isAdmin: "new admin of group",admin_name:admin_name[0].dataValues.name })
    }
    catch(err){
        console.log(err)
        console.log("admin not chganged bcknd")
    }
}



exports.remove_user = async (req,res,next ) =>{
    try{
        console.log("inside change admin")
        console.log(req.params.groupId,req.params.userId)
        const new_admin = await UserGroup.destroy({where:{userId:req.params.userId,groupId:req.params.groupId}})
        return res.status(200).json({ isAdmin: "new admin of group" })

    }
    catch(err){
        console.log(err)
        console.log("admin not chganged bcknd")
    }
}

exports.get_all_users = async (req,res,next) =>{
    try{
        console.log("aagaya")
        const relevantUsers = await Users.findAll()
            console.log("relevant users>>",relevantUsers)
            return res.status(200).json({ users:relevantUsers })

    }
    catch(err){
        console.log(err)
    }
}

exports.add_member = async (req,res,next) =>{
    try{
        console.log("aaggaya aga")

        new_member_exists = await UserGroup.findOne({where:{userId:req.params.userId,groupId:req.params.groupId}})
        console.log(new_member_exists)
        
        if(new_member_exists){
            return res.status(200).json({ usersexist:true })
        }
        else{
            const new_MEMBER = await UserGroup.create({userId:req.params.userId,groupId:req.params.groupId})
        console.log(new_MEMBER)
        return res.status(200).json({ usersexist:false })
        }
    }
    catch(err){
        console.log(err)
    }
}