const path = require('path')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
// console.log(BrowserSyncPlugin)

const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const ManifestPlugin = require('webpack-manifest-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
//const bootstrap = equire('bootstrap')r

const cssPath = './Styles/'


let postCssLoader = require('postcss-loader')
let cssLoaders = [{ loader : 'css-loader', options : { importLoaders : 1, sourcemap : true} }]
let sassLoader = { loader : 'sass-loader',options : { sourcemap : true} }
let MiniCssExtractPluginLoader = { loader : MiniCssExtractPlugin.loader }


module.exports = (env) => {
  if(!env.dev){
    cssLoaders.push(
      { 
        loader : 'postcss-loader',
        options : { 
          plugins : (loader) => [
            require('autoprefixer')({
              browsers : ['last 2 versions', 'ie > 7']
            }),
            require('cssnano')()
          ]
        } 
      }
    )
  }

  // console.log(env)
  return {
    mode: 'production',
    entry: {
      main: ['./assets/scss/main.scss','./assets/js/index.js']
    },
    output: {
      filename: 'Scripts/[name].js',
      path: path.resolve(__dirname, '../Public/')
    },
    // watch : true,
    devtool: env.dev ? 'cheap-module-eval-source-map' : 'source-map',
//    devServer: {
//      overlay:true,
//      contentBase: path.resolve('./public'),
//      watchContentBase: true
//    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: ['babel-loader']
        },
        {
          test: /\.css$/,
          use: [
            env.dev ? 'style-loader' : MiniCssExtractPluginLoader,
            ...cssLoaders
          ]
        },
        {
          test : /\.scss$/,
          use: [
            env.dev ? MiniCssExtractPluginLoader : MiniCssExtractPluginLoader,
            ...cssLoaders,
            {
              loader: 'postcss-loader',
            },
            sassLoader
          ]
        },
        {
        test: /\.(woff2?|eot|ttf|otf|png|jpg|gif|svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          // regExp: /\/([a-z0-9]+)\/[a-z0-9]+\.png$/,
          emitFile: false,
          name: '[name].[ext]',
          publicPath: '../../Public/Images/site/'
        }
      }

      ],
      
    },
    plugins : [
      new MiniCssExtractPlugin ({
        filename : env.dev ? cssPath+'[name].css' : cssPath+'[name].css',
        // disable : env.dev
      }),
    ],
  }

};