const webpack       = require("webpack");
const path          = require("path");
const uglify        = require("uglifyjs-webpack-plugin");
const ExtractText   = require("extract-text-webpack-plugin");
const BrowserSync   = require("browser-sync-webpack-plugin");

const dev = process.env.NODE_ENV === dev;

let cssLoaders = [
    {loader: "css-loader", options: {importLoaders: 1, minimize: !dev}}
]
if(!dev){
    cssLoaders.push({
        loader: "postcss-loader",
        options: {
            plugins: (loader) => [
                require("autoprefixer")({
                    browsers: ["last 2 versions", "ie >= 8"]
                }),
            ]
        }
    })
}


let config = {
    entry: "./js/app.js",
    watch: dev,
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "bundle.js",
        publicpath: "/dist/"
    },
    devtools: dev ? "cheap-module-eval-source-map" : false,
    devServer: {
        overlay: true,
        contentBase: path.resolve("/public"),
        headers: {

        }
    },
    module: {
        rules: [
            {
                test: /\*.js$/,
                exclude: /(node_modules | bower_components )/,
                use: [
                    babel-loader
                ]
            },
            {
                test: /\*.css$/,
                use: ExtractText.extract({
                    fallback: "style-loader", 
                    use:    [css-loader]
                })
            },
            // {
            //     test: /\*.scss$/,
            //     use: [
            //         style-loader, css-loader, sass-loader
            //     ]
            // } Without autoprefixer
            {
                test: /\*.scss$/,
                use: ExtractText.extract({
                    fallback: "style-loader",
                    use: [
                        {
                        loader: "css-loader", 
                        options: {
                            importLoaders: 1 // Ignore the imports
                        }
                    }, 
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: (loader) => [
                                require("autoprefixer")({
                                    browsers: ["last 2 versions", "ie >= 8"]
                                }),
                            ]
                        }
                    },
                    "sass-loader"
                    ]
                })
                
            } //With autoprefixer
            // { Use wlth the dev vs prod
            //     test: /\*.scss$/,
            //     use: [
            //   ...cssLoaders,
            //    "sass-loader"
            //]
            // }
            
        ]
    },
    plugins: [
        new ExtractText({
            filename: '[name].css',
            disable: dev
        }),
        new webpack.optimizeCommonsChunkPlugin("shared.js"),
        new BrowserSync({
            host: "localhost",
            port: 300,
            files: ["./dist/*.html", "./dist/*.css"],
            proxy: {basedir: ['dist']}
        })
        //  new BrowserSync({
        //     host: "localhost",
        //     port: 300,
        //     files: ["./dist/*.php"],
        //     server: "http://localhost/myproject/"
        // }) With server side language
    ]
}

if(!dev){
    config.plugins.push(new uglify({
        "source-map": false
    }))
}

module.exports = config;