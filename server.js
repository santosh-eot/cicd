require('dotenv').config()
const express = require('express');
const writeYamlFile = require('write-yaml-file')
const fs = require('fs')
const app = express();
const PORT = process.env.PORT || 4000;
const bodyParser = require('body-parser')

app.use(bodyParser.json({limit:'50mb'}))
app.use(bodyParser.urlencoded({extended:true}))

app.listen(PORT, ()=>console.log(`server running on port ${PORT}`))

app.get('/', (req, res)=>{
    res.send(`update on host1 with params, dynamic env1: ${process.env.TEST1} en2: ${process.env.TEST2}`)
})

app.post('/create-yml', async(req, res)=>{
    try {
        let {server, host, key, env} = req.body
        let str = '', d
        for(let i in env){
            str += `${i}=${env[i]}\\n`
        }
        if(req.query.type == 'initial'){
            let {clone} = req.body
            let folder = clone.split('/')[1]
            folder = folder.split('.')[0]
            var data = fs.readFileSync('content/initial.txt', 'utf8')
            d = data.split(' ')
            let serverIndex = d.indexOf('serverValue')
            let hostIndex = d.indexOf('hostValue')
            let keyIndex = d.indexOf('keyValue')
            let cloneIndex = d.indexOf('cloneUrl')
            let folderIndex = d.indexOf('~/folder')
            let envIndex = d.indexOf('\"envValue\"')
            d[serverIndex] = `${server} `
            d[hostIndex] = "${{ secrets."+host+"}} "
            d[keyIndex] = "${{ secrets."+key+"}} "
            d[cloneIndex] = clone
            d[folderIndex] = `~/${folder}`
            d[envIndex] = `"${str}"`
            writeYamlFile.sync(`.github/workflows/${server}-initial.yaml`, d.join(' '))
        }else{
            var data = fs.readFileSync('content/cicd.txt', 'utf8')
            d = data.split(' ')
            let serverIndex = d.indexOf('serverValue')
            let hostIndex = d.indexOf('hostValue')
            let keyIndex = d.indexOf('keyValue')
            d[serverIndex] = `${server} `;
            d[hostIndex] = "${{ secrets."+host+"}} ";
            d[keyIndex] = "${{ secrets."+key+"}} ";
            writeYamlFile.sync(`.github/workflows/${server}-cicd.yaml`, d.join(' '))
        }
        res.send('done')
    } catch (error) {
        console.log(error)
    }
    
})

