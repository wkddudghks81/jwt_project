import { prisma } from '../../utils/prisma/index.js';
import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/sign-up', async (req, res, next) => {
    try{
    const {email,password,name} = req.body
    const hashedPassword = await bcrypt.hash(password, 10);
    const findemail = await prisma.User.findFirst({
        where :{
            email
        }
    })
    if(findemail){
        return res.status(409).json({message:'이미 존재하는 이메일'})
    }
    const data = await prisma.User.create({
        data:{
            email,
            password:hashedPassword,
            name
        }
    })
    return res.status(200).json({data:data})
    }catch (err) {
        next(err);
    }
});

router.post('/sign-in', async (req,res,next) =>{
    try{
    const {email, password} = req.body
    const data = await prisma.User.findFirst({
        where : {
            email
        }
    })
    if(email===data.email &&await bcrypt.compare(password, data.password)===true){
        return res.status(200).json({message:'로그인 성공'})
    }else{return res.status(200).json({message:'로그인 실패'})}
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
    return res.json({data:data1})
    }catch (err) {  
        next(err);
    }
});

export default router;