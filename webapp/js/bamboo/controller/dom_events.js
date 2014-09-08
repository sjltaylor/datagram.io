if(typeof define!=='function'){var define=require('amdefine')(module);}

define(function () {

  return function domEventsPlugin (Ctor) {
    
    Ctor.extend({
      domEvents: function () {

        if (arguments.length) {
          var declarations = this.__domEvents__
          declarations.push.apply(declarations, arguments)
          return this
        } else {
          return this.__domEvents__
        }
      }
    })

    Ctor.onInit(function () {
      this.__domEvents__ = []
    })
  }
})