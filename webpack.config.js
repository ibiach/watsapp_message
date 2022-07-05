const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin') // Импортируем плагин

let mode = 'development'
let target = 'web' // в режиме разработки browserslist не используется
if (process.env.NODE_ENV === 'production') {
	mode = 'production'
	target = 'browserslist' // в продакшен режиме используем browserslist
}

const plugins = [
	new HtmlWebpackPlugin({
		template: './public/index.html', // Данный html будет использован как шаблон
	}),
	new MiniCssExtractPlugin({
		filename: '[name].[contenthash].css', // Формат имени файла
	}), // Добавляем в список плагинов
] // Создаем массив плагинов

if (process.env.SERVE) {
	// Используем плагин только если запускаем devServer
	plugins.push(new ReactRefreshWebpackPlugin())
} // Данный код должен быть размещен после объявления массива plugins

module.exports = {
	mode,
	target,
	plugins,
	entry: './src/index.js', // Указываем точку входа - главный модуль приложения,
	// в который импортируются все остальные
	devtool: 'source-map',
	stats: {
		children: true,
	},
	resolve: { extensions: ['.js', '.jsx'] },
	output: {
		path: path.resolve(__dirname, 'dist'),
		assetModuleFilename: 'assets/[hash][ext][query]', // Все ассеты будут
		// складываться в dist/assets
		clean: true,
	},
	devServer: {
		hot: true, // Включает автоматическую перезагрузку страницы при изменениях
	},
	module: {
		rules: [
			{ test: /\.(html)$/, use: ['html-loader'] },
			{
				test: /\.(s[ac]|c)ss$/i, // /\.(le|c)ss$/i если вы используете less
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
			}, // Добавляем загрузчики стилей
			{
				test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
				type: mode === 'production' ? 'asset' : 'asset/resource', // В продакшен режиме
				// изображения размером до 8кб будут инлайнится в код
				// В режиме разработки все изображения будут помещаться в dist/assets
			},
			{
				test: /\.(woff2?|eot|ttf|otf)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.js$/,
				exclude: /node_modules/, // не обрабатываем файлы из node_modules
				use: {
					loader: 'babel-loader',
					options: {
						cacheDirectory: true, // Использование кэша для избежания рекомпиляции
						// при каждом запуске
					},
				},
			},
			{
				test: /\.jsx?$/, // обновляем регулярное выражение для поддержки jsx
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						cacheDirectory: true,
					},
				},
			},
		],
	},
}
