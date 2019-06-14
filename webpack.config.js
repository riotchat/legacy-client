const path = require('path');

module.exports = {
	entry: './src/index.tsx',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.(png|jpg|gif|svg|ico)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]?[hash]',
					outputPath: 'assets'
				}
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].css'
						}
					},
					'extract-loader',
					'css-loader',
					'resolve-url-loader',
					{
						loader: 'sass-loader',
						options: {
							includePaths: [
								path.resolve(__dirname, 'bundle')
							],
							sourceMap: true
						}
					}
				]
			},
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
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
		//new (require('html-webpack-plugin'))({
		//	template: './src/index.html'
		//})
	],
	devServer: {
		disableHostCheck: true
	}
};