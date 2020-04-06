const express = require("express")
const app = express()
const path = require("path")
const fs = require("fs");
const {createBundleRenderer} = require("vue-server-renderer");
const serverBundle = require("../dist/vue-ssr-server-bundle.json")
const clientManifest = require("../dist/vue-ssr-client-manifest.json")


const renderer = createBundleRenderer(serverBundle,{
    runInNewContext:false,
    template :fs.readFileSync(__dirname+"/index.template.html","utf-8"),
    clientManifest
})

app.use("/",express.static(path.resolve(__dirname,"../static")))
app.use("/static",express.static(path.resolve(__dirname,"../dist/")))

app.get("*",(req,res)=>{

    const context = {
        url:req.url
    }

    renderer.renderToString(context,(err,html)=>{
        if (err){
            if (err.code === 404){

                res.status(404).end("Page not found")
            }else{
                res.status(500).end("Internal Server Error")
            }
        }else{
            res.send(html)
        }
    })

})



app.listen(3000,()=>{
    console.log("started listen port is 3000");
    console.log("http://localhost:3000")
})