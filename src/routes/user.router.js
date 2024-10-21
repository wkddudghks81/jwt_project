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

export default router;