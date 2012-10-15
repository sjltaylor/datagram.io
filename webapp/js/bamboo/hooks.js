if(typeof define!=='function'){var define=require('amdefine')(module);}

define(function(){

  function around (method, callback){
    
    var originalOwnMethod,
        parentPrototype = Object.getPrototypeOf(this)
    
    if (this.hasOwnProperty(method)) 
      originalOwnMethod = this[method]
    
    this[method] = function hookedFunction () {

      var args = arguments, zuper

      if (originalOwnMethod) {
        zuper = originalOwnMethod.bind(this)      
      } else if (parentPrototype[method]) {
        zuper = parentPrototype[method].bind(this)
      } else {
        zuper = function noop () {}
      }

      return callback.bind(this, zuper).apply(this, arguments)
    }

    return this
  }

  function before (method, callback){
    return this.around(method, function (original) {
      
      var args = Array.prototype.slice.call(arguments, 1)
      callback.apply(this, args)
      return original.apply(this, args)
    })
  }

  function after (method, callback){
    return this.around(method, function (original) {
      
      var args = Array.prototype.slice.call(arguments, 1)

      var rtn = original.apply(this, args)
      callback.apply(this, args)

      return rtn 
    })
  }

  hooks.mixin = {
    around: around,
    before: before,
    after: after
  }

  function hooks (ctor) {
    ctor.extend(hooks.mixin).prototype.extend(hooks.mixin)
  }

  return hooks
})
