if(typeof define!=='function'){var define=require('amdefine')(module);}

define(function () {

  return function appEventsPlugin (Ctor) {
    
    Ctor.extend({
      appEvents: function () {

        if (arguments.length) {
          var declarations = this.__appEvents__
          declarations.push.apply(declarations, arguments)
          return this
        } else {
          return this.__appEvents__
        }
      }
    })

    Ctor.onInit(function () {
      this.__appEvents__ = []
    })
  }
})