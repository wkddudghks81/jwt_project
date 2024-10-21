import { prisma } from '../../utils/prisma/index.js';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import auth from '../../middlewares/auth.js'

const router = express.Router();

const SECRET_KEY = 'secret'; // Access Token의 비밀 키 정의

// 회원가입 API
router.post('/sign-up', async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // 이메일 중복 검사
        const existingUser = await prisma.User.findFirst({
            where: { email }
        });
        if (existingUser) {
            return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
        }

        // 사용자 생성
        const newUser = await prisma.User.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });
        return res.status(201).json({ message: '회원가입 성공', data: newUser });

    } catch (err) {
        next(err);
    }
});

// 로그인 API
router.post('/sign-in', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 사용자를 찾습니다.
        const user = await prisma.User.findFirst({
            where: { email }
        });

        // 사용자가 존재하지 않거나 비밀번호가 맞지 않는 경우
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: '로그인 실패' });
        }

        // JWT 토큰 생성
        const token = jwt.sign({ userid: user.userid }, SECRET_KEY, { expiresIn: '1h' });
        res.setHeader('authorization', `Bearer ${token}`);

        return res.status(200).json({ message: '로그인 성공', token });

    } catch (err) {
        next(err);
    }
});

// 사용자 삭제 API
router.delete('/userdelete', auth, async (req, res, next) => {
    try {
        const {email,password} = req.body

        // 사용자를 찾습니다.
        const user = await prisma.User.findFirst({
            where: { email }
        });

        // 사용자가 존재하지 않거나 비밀번호가 맞지 않는 경우
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: '인증 실패' });
        }

        // 사용자 삭제
        await prisma.User.delete({
            where: { userid: user.userid }
        });

        // 모든 사용자 ID를 다시 가져와 반환합니다.
        const users = await prisma.User.findMany({
            select: { userid: true }
        });

        return res.status(200).json({ message: '사용자 삭제 성공', data: users });

    } catch (err) {
        next(err);
    }
});

export default router;
