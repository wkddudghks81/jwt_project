import express from 'express'
import userrouter from './routes/user.router.js'
import error from '../middlewares/error.js'
import cookieParser from 'cookie-parser';

const app = express()
const port = "3000"

app.use(express.json())	//body json형태 요청을 받기 위해

app.use(cookieParser());
app.use('/user',[userrouter])

app.use(error)
app.listen(port,(req,res) => {
	console.log(port+" 서버 시작")
})