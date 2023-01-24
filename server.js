require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const bodyParser = require('body-parser')
const {createYML} = require('./helper')
app.use(bodyParser.json({limit:'50mb'}))
app.use(bodyParser.urlencoded({extended:true}))

app.listen(PORT, ()=>console.log(`server running on port ${PORT}`))

app.get('/', (req, res)=>{
    res.send(`hello world`)
})

app.post('/create-yml', createYML)

