const path = require("path");
const uglify = require("uglifyjs-webpack-plugin");

module.exports = {
    entry: "./js/app.js",
    watch: true,
    output: {
        path: path.resolve("./dist"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\*.js$/,
                exclude: /(node_modules | bower_components )/,
                use: [
                    babel-loader
                ]
            }
        ]
    },
    plugins: [
        new uglify()
    ]
}