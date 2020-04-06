const path = require("path");
const webpack = require("webpack")
const merge = require("webpack-merge")
const baseConfig = require("./webpack.base.conf")
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin")

const isProd = process.env.NODE_ENV === 'production'

module.exports = merge(baseConfig,{
    mode:process.env.NODE_ENV  || "development",
    entry:path.resolve(__dirname,"..","src/entry-client.js"),
    plugins:[
        new VueSSRClientPlugin()
    ]
})