# webpack-sprite-image
生成雪碧图


> 如何使用

##### 必须在根目录生成  webpack-sprite.js 文件


大致文件如下

```javascript
const WebpackSprite = require('webpack-sprite-image')
const resolve = require('path').resolve

let sprite = new WebpackSprite;

sprite.images([ resolve('./icons'), resolve('./icon') ], resolve('./dist/sprites/sprite.png'))
	.option({
		ext: ['png', 'jpg'],
		css: resolve('./dist/sprites/sprite.css'),
		algorithm: 'top-down',
		cssImageRef: '../sprites/sprite.png',
		//templateFunction
	}).
	setExt(['png', 'jpg'])
	
module.exports = sprite
```
