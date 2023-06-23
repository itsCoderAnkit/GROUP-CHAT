const express = require('express')
const path = require('path')
const Users = require('../model/user_signup')
const Message = require('../model/message')
const sequelize = require('../util/database');
const AWS  = require('aws-sdk')
const fs = require('fs')

function uploadtoS3(data,filename){
    console.log('data>>',data)
    const BUCKET_NAME='newgroup';
    const IAM_USER_KEY = '';
    const IAM_USER_SECRET =''

    let S3bucket = new AWS.S3({
        accessKeyId : IAM_USER_KEY,
        secretAccessKey : IAM_USER_SECRET
    })

    const fileStream = fs.createReadStream(data.path)

    var params ={
        Bucket:BUCKET_NAME,
        Key:filename,
        Body:fileStream,
        ACL:'public-read'
    }

    return new Promise ((resolve,reject) =>{

        S3bucket.upload(params,(err,S3response) =>{
            if(err){
                console.log(err)
                console.log('something in s3 upload promise wrong')
                reject(err)
            }
            else{
                console.log('success',S3response)
                resolve(S3response.Location)
            }
        })
    })
}



exports.upload_image= async (req,res,next) =>{
    try{
        console.log("req>>",req.file)

        const fileURL = await uploadtoS3 (req.file, `${new Date()} - ${req.file.originalname}`)
        console.log(fileURL)
        res.status(200).json({fileURL:fileURL,success:true})
    }
    catch(err){
        console.log(err)
    }
}
