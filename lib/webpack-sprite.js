const optionKeys = ['path', 'target', 'ext', 'css', 'algorithm', 'cssImageRef', 'templateFunction' ]

const defaultOptions = {
	ext: [ 'png' ],
	algorithm: 'binary-tree'
}

let WebpackSprite = function(options = {}){
	this.options = Object.assign(defaultOptions, options)
	optionKeys.map(key => this.observer(key))
}

WebpackSprite.prototype = Object.fromEntries(optionKeys.map(key => {
	return [ 'set' + key.charAt(0).toUpperCase() + key.slice(1), function(value){
		this.option({
			[key]: value
		})
		return this
	}]
}))

WebpackSprite.prototype.constructor = WebpackSprite

WebpackSprite.prototype.observer = function(key){
	Object.defineProperty(this, key, {
		get(){
			return this.options[key]
		},
		set(value){
			if(['path', 'ext'].indexOf(key) > -1 && ! value instanceof Array) value = [ value ]
			this.options[key] = value
		}
	})
}

WebpackSprite.prototype.images = function(path, target){
	if(! path instanceof Array) path = [ path ]
	
	this.option({ path, target })
	
	return this
}
	
WebpackSprite.prototype.option = function(option){
	for(var key in option){
		this[key] = option[key]
	}
	return this
}

module.exports = WebpackSprite