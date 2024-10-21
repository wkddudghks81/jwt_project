import { prisma } from '../../utils/prisma/index.js';
import express from 'express';

const router = express.Router();

router.post('/sign-up', async (req, res, next) => {
    try{
    const {email,password,name} = req.body
    const data = await prisma.User.create({
        data:{
            email,
            password,
            name
        }
    })
    const findemail = await prisma.User.findFirst({
        data :{
            email
        }
    })
    if(findemail){
        res.status(409).json({message:'이미 존재하는 이메일'})
    }
    res.status(200).json({data:data})
    }catch (err) {
        next(err);
    }
});

router.post('/sign-in', async (req,res,next) =>{
    try{
    const {email, password} = req.body
    const data = await prisma.User.findFirst({
        where : {
            email,
            password
        }
    })
    if(email===data.email && password === data.password){
        res.status(200).json({message:'로그인 성공'})
    }
    }catch (err) {
        next(err);
    }
});

router.delete('/userdelete', async (req,res,next) =>{
    try{
    const {userid} = req.body
    await prisma.User.delete({
        where:{
            userid
        }
    })
    const data1 = await prisma.User.findMany({
        select:{
            userid:true
        }
    })
    res.json({data:data1})
    }catch (err) {  
        next(err);
    }
});

export default router;