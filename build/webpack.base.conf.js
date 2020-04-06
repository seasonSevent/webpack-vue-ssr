const path = require("path");
const VUeLoaderPlugin = require("vue-loader/lib/plugin")

const isProd = process.env.NODE_ENV === "production";

module.exports ={
    mode:"production",
    output: {
        path:path.resolve(__dirname,"../dist"),
        filename: "[name].[hash].js",
        publicPath: "/"
    },
    resolve: {
        extensions: [".js",".vue",".json"],
        alias: {
            "@":path.resolve(__dirname,"../src"),
        }
    },
    module: {
        rules:[
            {
                test:/\.vue$/,
                use:"vue-loader"
            },
            {
                test:/\.css$/,
                use:["vue-style-loader","css-loader","postcss-loader"]
            },
            {
                test:/\.js$/,
                use:"babel-loader",
                exclude: /node_modules/
            },
            {
                test:/\.(png|svg|jpg|gif)$/,
                use:["file-loader"]
            },
            {
                test:/\.(woff|woff2|eot|ttf|otf)$/,
                use:["file-loader"]
            }
        ]
    },
    plugins: [
        new VUeLoaderPlugin()
    ]
}