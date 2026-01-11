import express from "express"

const app = express();

app.post('/hooks/catch/:userid/:zapid',(req,res)=>
	{
		const userId = req.params.userId;
		const zapId = req.params.zapId;
				
	}
