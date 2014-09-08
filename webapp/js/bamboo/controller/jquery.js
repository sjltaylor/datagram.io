if(typeof define!=='function'){var define=require('amdefine')(module);}

define(['jquery', 'bamboo/controller', './default_dom'], function ($, controller, defaultDom) {

  function jqueryDomInterface (controller) {

    controller.onInit(function () {

      if (this.dom === undefined)
        this.dom = this.constructor.dom()

      if (!(this.dom instanceof $))
        this.dom = $(this.dom)

      this.constructor.domEvents().forEach(function (binding) {
        
        if (binding.length === 3) {
          
          (function (selector, event, fnName) {
            this.dom.find(selector).bind(event, this[fnName].bind(this))
          
          }).apply(this, binding)
        
        } else {

          (function (event, fnName) {

            this.dom.bind(event, this[fnName].bind(this))
          
          }).apply(this, binding)
        }

      }.bind(this))
    })

    controller.after('destroy', function () {
      this.dom.remove()
    })
  }

  controller.domInterface = jqueryDomInterface

  return jqueryDomInterface
})
