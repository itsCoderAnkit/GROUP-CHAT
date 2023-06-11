const express = require('express')
const path = require('path')
const User = require('../model/user_signup.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


exports.user_signup = async (req, res, next) => {
    try {
        await res.sendFile(path.join(__dirname, "../", "views", "signup.html"))
    }
    catch (err) {
        console.log(err)
        console.log("USER SIGN UP PAGE LOADING FAILED")
    }

}

exports.post_user_sign_up = async (req, res, next) => {
    try {
        const username = req.body.name
        const useremail = req.body.email
        const userphone = req.body.phone
        const userpassword = req.body.password


        console.log(" backend ", username,useremail,userphone,userpassword)

        if (!useremail || !username || !userpassword || !userphone) {
            return res.status(500).json({
                error: " ALL USER DETAILS NOT PROVIDED"
            })
            // throw new Error( "USER EMAIL NOT PROVIDED")
            //console.log("USER EMAIL NOT PROVIDED")
        }

        console.log("Existing users")

        const existinguser = await User.findAll({ where: { email: useremail } })


        console.log("existinguser[0]", existinguser[0])

        if (existinguser[0]) {
            return res.status(500).json({ error: "USER ALREADY EXISTS" })
        }

        console.log("bcrypt")
        bcrypt.hash(userpassword, 10, async (err, hash) => {

            console.log("err", err)
            console.log("hash", hash)
            const userDetails = await User.create({
                name: username,
                email: useremail,
                phone: userphone,
                password: hash
            })
            res.status(201).json({ userDetails: userDetails })
            console.log(userDetails)
        })

    }
    catch (err) {
        res.status(500).json({ error: err })
        console.log(" USER SIGNUP DETAILS NOT SAVED IN DATABASE")
    }

}

exports.get_user_login = async (req, res, next) => {
    try {
        await res.sendFile(path.join(__dirname, '../', 'views', 'login.html'))
    }
    catch (err) {
        res.status(500).json({ error: err })

        console.log("UNABLE TO LOAD LOGIN PAGE")
    }

}

function generateAccessToken(id, name,email) {
    return jwt.sign({ userId: id, name: name ,email:email}, process.env.JWT_SECRET_KEY)
}

exports.post_user_login = async (req, res, next) => {
    try {
        const useremail = req.body.email
        const userpassword = req.body.password

        console.log(useremail, userpassword)
        const existinguser = await User.findAll({ where: { email: useremail } })
        console.log(existinguser[0].isPremiumUser)
        if (existinguser[0]) {

            bcrypt.compare(userpassword, existinguser[0].password, (err, result) => {
                if (err) {
                    res.status(500).json({ success: false, message: "Something Went Wrong" })
                }
                if (result === true) {
                    console.log("WELCOME TO CHAT APP")
                        const isactiveupdate = User.update({isactive:true},{where:{email:useremail}})
                        return res.status(200).json({ success: true, message: "user logged in successfully", existinguser: existinguser[0],token:generateAccessToken(existinguser[0].id,existinguser[0].name,existinguser[0].email) })  
                }
                else {
                    return res.status(401).json({ success: false, message: "password is wrong", ERROR: "User not authorized" })
                }
            })
            // if (existinguser[0].password == userpassword) {
            //     console.log("WELCOME TO EXPENSE TRACKER")
            //     return res.status(200).json({ existinguser: existinguser[0] })
            // }
            // else {
            //     return res.status(401).json({ ERROR: "User not authorized" })
            // }

        }
        if (!existinguser[0]) {
            return res.status(404).json({ error: "USER NOT FOUND" })
        }

    }
    catch (err) {
        res.status(500).json({ error: err })
        console.log("UNABLE TO VERIFY LOGIN DETAILS")
    }
}

exports.user_logout = async (req,res,next)=>{
    console.log("req.user>>>>",req.user.email)
    useremail = req.user.email
    const isunactiveupdate = User.update({isactive:false},{where:{email:useremail}})
    return res.status(200).json({ success: true, message: "user logged out successfully"})
}