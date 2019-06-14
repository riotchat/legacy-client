const path = require('path');

module.exports = {
	entry: './src/index.tsx',
	module: {
		rules: [
			/*{
				test: /\.svg$/,
				loader: 'svg-inline-loader'
			},*/
			{
				test: /\.tsx?$/,
				use: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.(png|jpg|gif|ico|svg)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]?[hash]',
					outputPath: 'assets'
				}
			},
			{
				test: /\.module\.scss|\.scss|\.css$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: true
						}
					},
					'resolve-url-loader',
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
						useRelativePath: true,
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
			},
			{
				test: /\.(html)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]'
						}
					},
					'extract-loader',
					{
						loader: 'html-loader',
						options: {
							attrs: ['img:src', 'link:href']
						}
					}
				]
			}
		]
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ]
	},
	output: {
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
		new (require('mini-css-extract-plugin'))({
			filename: '[name].css',
			chunkFilename: '[id].css'
		})
	],
	devServer: {
		disableHostCheck: true
	}
};