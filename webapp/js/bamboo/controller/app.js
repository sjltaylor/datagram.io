if(typeof define!=='function'){var define=require('amdefine')(module);}

define(['../events/subscriber'], function (subscriber) {

  return function appEventBinding (controller) {

    controller.use(subscriber)
    
    controller.onInit(function () {
      
      this.constructor.__appEvents__.forEach(function (binding) {
        
        (function (objName, eventName, fnName) {
          
          this.subscribe(this[objName], eventName, this[fnName])
        
        }).apply(this, binding)

      }.bind(this))
    })
  }
})
