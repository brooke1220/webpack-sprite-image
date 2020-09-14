const fs = require('fs-extra')
const resolve = require('path').resolve
const SpritesmithPlugin = require('webpack-spritesmith')
const WebpackSprite = require(resolve('webpack-sprite')) || { }

function randomString(e) {  
	e = e || 32;
	var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
	a = t.length,
	n = "";
	for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
	return n
}


let entry = randomString( 8 )
let tempDir = resolve('temp_' + randomString( 8 ))
let exts = WebpackSprite.ext || [ 'png' ]

var getGlob = function(){
	if(exts.length == 1){
		return '*.' + exts[0]
	}
	
	return '*.{' + exts.join(', ') + '}'
}

var templateFunction = function (data) {
  var shared = '.icon { background-image: url(I);background-size: Wpx Hpx;}'
	.replace('I', data.sprites[0].image)
	.replace('W', data.spritesheet.width)
    .replace('H', data.spritesheet.height)

  var perSprite = data.sprites.map(function (sprite) {
    return '.icon-N { width: Wpx; height: Hpx; background-position: Xpx Ypx; }'
      .replace('N', sprite.name)
      .replace('W', sprite.width)
      .replace('H', sprite.height)
      .replace('X', sprite.offset_x)
      .replace('Y', sprite.offset_y);
  }).join('\n');

  return shared + '\n' + perSprite;
}

const pluginName = 'OnBuildWebpackPluginDone';

class OnBuildWebpackPlugin {
	constructor(options = {}) {
	
	}
	
	apply(compiler) {
		if (compiler.hooks) {
			compiler.hooks.environment.tap(pluginName, this.onRun)
			compiler.hooks.done.tap(pluginName, this.onDone)
		}else{
			compiler.plugin('environment', this.onRun)
			compiler.plugin('done', this.onDone)
		}
	}
	
	onDone(status){
		fs.unlinkSync(resolve(entry + '.js'))
		fs.emptyDirSync(tempDir)
		fs.rmdirSync(tempDir)
	}
	
	onRun(params){
		fs.mkdirSync(tempDir)
		
		let imagePath = WebpackSprite.path || []
		let rule = new RegExp('.*\.('+ exts.join('|') +')', 'i')
		
		for(var dirPath of imagePath){
			let files = fs.readdirSync(dirPath)
			for(let file of files){
				if(rule.test(file)){
					fs.copySync(resolve(dirPath, file), resolve(tempDir, file))
				}
			}
		}
	}
}


const webpackConfig = {
	entry: {
		[entry]: [
			resolve(__dirname, '../index.js')
		]
	},
	output: {
		filename: '[name].js'
	},
	plugins: [
		new SpritesmithPlugin({
			src: {
				cwd: tempDir,
				glob: getGlob()
			},
			target: {
				image: WebpackSprite.target || resolve('./dist/sprites/sprite.png'),
				css: [
					[ WebpackSprite.css || resolve('./dist/sprites/sprite.css'), {
						format: 'function_based_template'
					}]
				]
			},
			customTemplates: {
			   'function_based_template': WebpackSprite.templateFunction || templateFunction,
			},
			apiOptions: {
				cssImageRef: WebpackSprite.cssImageRef || '../sprites/sprite.png'
			},
			spritesmithOptions: {
				algorithm: WebpackSprite.algorithm ||'binary-tree'
			}
		}),
		
		new OnBuildWebpackPlugin()
	]
}

module.exports = webpackConfig