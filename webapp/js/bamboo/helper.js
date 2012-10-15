if(typeof define!=='function'){var define=require('amdefine')(module);}

define(['bamboo/type'], function (Type) {

  var plugins = []

  function clearPlugins () {
    plugins = []
  }

  function plugin () {
    
    if (arguments.length == 2) {
      plugins.push({selector: arguments[0], plugin: arguments[1]})
    } else {
      for (var selector in arguments[0])
          plugins.push({selector: selector, plugin: arguments[0][selector]})
    }

    return this
  }

  return Type.sub('Helper')
    .prototype
      .onInit(function (root) {
        this.$ = root
        
        for (var i = 0; i < plugins.length; i++) {
          
          var selector = plugins[i].selector, 
              plugin   = plugins[i].plugin

          if (this.$.is(selector)) {
            this.use(plugin)
          }
        }
      })
    .constructor
      .extend({
        plugin: plugin,
        clearPlugins: clearPlugins
      })
})

