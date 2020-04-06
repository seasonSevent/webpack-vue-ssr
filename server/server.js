const express = require("express")
const app = express()
const fs = require("fs");
const {createBundleRenderer} = require("vue-server-renderer");
const serverBundle = require("../dist/vue-ssr-server-bundle.json")
const clientManifest = require("../dist/vue-ssr-client-manifest.json")


const renderer = createBundleRenderer(serverBundle,{
    runInNewContext:false,
    template :fs.readFileSync(__dirname+"/index.template.html","utf-8"),
    clientManifest
})

app.get("*",(req,res)=>{

    const context = {
        url:req.url
    }

    renderer.renderToString(context,(err,html)=>{
        res.send(html)
    })

})



app.listen(3000,()=>{
    console.log("started listen port is 3000");
    console.log("http://localhost:3000")
})