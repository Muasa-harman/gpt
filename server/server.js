const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')
require('dotenv').config();
const app = express();
app.use(bodyParser.json());
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    organization: "org-qdecFOz82v2AADy1NF6QAtcm",
    apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/',async(req,res)=>{
    const {message} = req.body;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${message}`,
      max_tokens: 100,
      temperature: 0.5,
    });
    
    app.get('/models',async (req,res)=>{
      const response = await openai.listEngines();
      console.log(response.data.data)
      res.json({models:response.data.data})
    })
    res.json({
      message: response.data.choices[0].text,
    })
});





app.listen(process.env.PORT,()=>{
    console.log("server render")
})