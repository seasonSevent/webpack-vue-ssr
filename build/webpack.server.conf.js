const path = require("path");
const merge = require("webpack-merge")
const nodeExternals = require("webpack-node-externals")
const baseConfig = require("./webpack.base.conf")
const VueSSRClientPlugin = require("vue-server-renderer/server-plugin")

module.exports = merge(baseConfig,{
    mode:"production",
    entry: path.join(__dirname, '../src/entry-server.js'),
    target:"node",
    devtool:"source-map",
    output:{
        libraryTarget:"commonjs2"
    },
    externals:nodeExternals({
        whitelist:/\.css$/
    }),
    plugins:[
        new VueSSRClientPlugin()
    ]
})