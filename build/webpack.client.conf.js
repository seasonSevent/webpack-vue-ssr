const path = require("path");
const webpack = require("webpack")
const merge = require("webpack-merge")
const baseConfig = require("./webpack.base.conf")
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin")

module.exports = merge(baseConfig,{
    entry:path.resolve(__dirname,"..","src/entry-client.js"),
    plugins:[
        new VueSSRClientPlugin()
    ]
})