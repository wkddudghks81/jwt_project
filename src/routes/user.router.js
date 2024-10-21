import { prisma } from '../utils/prisma/index.js';

import express from 'express';
const router = express.Router();

router.post('/sign-up', async (req, res) => {
    const {email,password,name} = req.body
    const data = await prisma.User.create({
        data:{
            email,
            password,
            name
        }
    })
    res.status(200).json({data:data})
})

export default router;