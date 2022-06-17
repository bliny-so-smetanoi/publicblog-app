const mongo = require("mongoose")
const express = require("express")
const config = require("config")
const path = require("path")

const app = express()

app.use(express.json({extended: true}))

app.use('/api/auth', require('./routes/authorization-routes'))
app.use('/api/articles', require('./routes/article-routes'))

if(process.env.NODE_ENV==='production'){
    app.use('/',express.static(path.join(__dirname,'frontend','build')))
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,'frontend','build','index.html'))
    })
}

const PORT = process.env.PORT || config.get("port")

async function start(){
    try{
        console.log("Starting server.")
        console.log("Connecting to database...")
        await mongo.connect(config.get("mongoUri"),{
            useNewUrlParser:true,
            useUnifiedTopology: true
        })
        app.listen(PORT, ()=>console.log(`Server has been started at port: ${PORT}!`))
    }catch (e){
        console.error(`Error: ${e.message}`)
        process.exit(1)
    }
}

start()