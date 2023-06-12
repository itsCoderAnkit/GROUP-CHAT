const express = require('express')
const path = require('path')
const Users = require('../model/user_signup')
const Message = require('../model/message')
const sequelize = require('../util/database');
const { Op } = require("sequelize");

exports.user_chat = async (req, res, next) => {
    try {
        await res.sendFile(path.join(__dirname, "../", "views", "chat.html"))
    }
    catch (err) {
        console.log(err)
        console.log("USER CHAT PAGE LOADING FAILED")
    }

}

exports.user_getchats = async(req,res,next)=>{
    try{
        const activeusers = await Users.findAll({where:{isactive:true}})
        console.log("active users>>>>.",activeusers)
        res.status(201).json({ activeusers: activeusers })
    }
    catch (err) {
        console.log(err)
        console.log("USER GET CHAT PAGE LOADING FAILED")
    }
}

exports.save_chat = async(req,res,next) =>{
    try{
        console.log(req.body.newmessage)
        console.log(req.user.id)
        const user_messages = await Message.create({
            message: req.body.newmessage,
            
            userId: req.user.id
        })
        console.log("user_messaages>>",user_messages)
        res.status(201).json({ user_messages: user_messages })
    }
    catch (err){
        console.log(err)
        console.log("CHAT NOT SAVE IN DB")
    }
}

exports.get_all_chats = async (req,res,next)=>{
    try{
        console.log("param>>",req.params.last_msg_id)
        console.log(typeof(+req.params.last_msg_id))
        // const newnum = 4
        // if(newnum === -1){
        //     console.log("run")
        //     //const all_messages = await Message.findAll()    
        // }
        // else if(newnum > -1){
        //     console.log("i am running")
            
        //     const all_messages = await Message.findAll()
            
        // }
         //const all_messages = await Message.findAll()
         const all_messages = await Message.findAll({ where: { id: { [Op.gt]: req.params.last_msg_id }} });
         
         const all_users = await Users.findAll()
        
        console.log("all_messages>---",all_messages)
        console.log("all_users>>>>>",all_users)
        res.status(200).json({ all_messages: all_messages,all_users:all_users })


    }
    catch(err){
        console.log(err)
        console.log("UNABLE TO LOAD ALL MESSAGES")
    }
}