if(typeof define!=='function'){var define=require('amdefine')(module);}

define(['jquery', 'bamboo/hooks'], function ($, hooks) {

  function chainProto (child, parent) {
    function ctor() {
      this.constructor = child
    }
    ctor.prototype = parent.prototype
    child.prototype = new ctor()
  }

  function Type () {}
  
  Type.sub = function (name) {
    
    if (!name.match(/^[A-Z]\w*$/)) {
      throw "invalid name '" + name + "'"
    }

    eval("var t=function " + name + "(){if(this.init)this.init.apply(this,arguments)}")
    
    $.extend(t, this)
    chainProto(t, this)

    return t
  }

  Type.use = function () {
    
    var plugin = arguments[0]
    arguments[0] = this
    plugin.apply(null, arguments)

    return this
  }

  Type.extend = function (ext) {
    
    for (var member in ext) {
      if (member in this) {
        throw new Error('"' + member + '" is already defined')
      } else {
        this[member] = ext[member] 
      }
    }

    return this
  }

  Type.onInit = function (fn) {
    
    fn.call(this)
    
    this.around('sub', function (fwd) {
      var Sub = fwd.apply(this, Array.prototype.slice.call(arguments, 1))
      fn.call(Sub)
      return Sub
    })

    return this
  }

  function onInit (fn) {
    
    // if onInit is being called on a prototype of a Type.sub constructor
    if (('constructor' in this) && this == this.constructor.prototype) {
      this.after('init', fn)
    } else {
      fn.call(this)
    }

    return this
  }

  Type.prototype.extend = Type.extend
  Type.prototype.onInit = onInit
  Type.prototype.use    = Type.use

  Type.use(hooks)

  return Type
})
