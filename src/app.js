import express from 'express'

const app = express()

app.use(express.json())	//body json형태 요청을 받기 위해

const port = "3000"

app.get("/",(req,res) =>{
	res.status(200).send('hello')
})

app.listen(port,(req,res) => {
	console.log(port+"서버 시작")
})