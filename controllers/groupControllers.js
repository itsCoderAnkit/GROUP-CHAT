const path = require('path')
const Users = require('../model/user_signup')
const Message = require('../model/message')
const Group = require('../model/groups')
const UserGroup = require('../model/usergroup')

exports.get_new_group = async (req, res, next) => {
    try {
        console.log("newgroup")
        await res.sendFile(path.join(__dirname, "../", "views", "newgroup.html"))
    }
    catch (err) {
        console.log(err)
        console.log("CREATE GROUP PAGE LOADING FAILED")
    }

}


exports.post_new_group = async (req, res, next) => {
    try {
        console.log(req.body)
        //console.log("user>>",req.user.id)
        const groupDetails = await Group.create({
            groupname: req.body.groupName,

        })
        const UserGroupDetails = await UserGroup.create({
            userId: req.user.id,
            groupId: groupDetails.id


        })
        return res.status(200).json({ success: true, message: "group created  successfully", groupDetails: groupDetails, UserGroupDetails: UserGroupDetails })

    }
    catch (err) {
        console.log(err)
        console.log("unable to save group name in db")
    }
}

exports.get_all_groups = async (req, res, next) => {
    try {
        const groupId = await UserGroup.findAll({ where: { userId: req.user.id } })
        console.log("groupId>>", groupId.length)
        let all_group_array = []
        for (let i = 0; i < groupId.length; i++) {
            console.log(i, ">>>", groupId[i].dataValues.groupId)
            const groups = await Group.findAll({ where: { id: groupId[i].dataValues.groupId } })
            console.log("groupId", groups[0].dataValues)
            all_group_array.push(groups[0].dataValues)
        }

        console.log("all group arrays", all_group_array)

        // const groups = await Group.findAll({ where: { id: groupId.groupId } })
        // console.log("groupId",groups)
        return res.status(200).json({ success: true, message: "all group related to user caught successfully", AllgroupDetails: all_group_array })
    }
    catch (err) {
        console.log(err)
        console.log("UNABLE TO LOAD ALL GROUPS")
    }
}

exports.join_group = async (req, res, next) => {
    try {
        groupId = req.params.groupId
        userId = req.user.id
        console.log("join group", groupId, userId)

        const already_groups_member = await UserGroup.findAll({
            where: {
                userId: req.user.id,
                groupId: groupId
            }
        })

        console.log(already_groups_member)

        if (already_groups_member.length>0) {
            console.log("already a group member")
            return res.status(500).json({ success: false, message: "Already a group Member"})
        }

        else {
            const UserGroupDetails = await UserGroup.create({
                userId: req.user.id,
                groupId: groupId


            })

            return res.status(201).json({ success: true, message: "JOINED as a group Member"})
        }


    }
    catch (err) {
        console.log(err)
        
    }
}