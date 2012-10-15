if(typeof define!=='function'){var define=require('amdefine')(module);}

define(['jquery', 'bamboo/controller', 'bamboo/helper', 'bamboo/jquery.helper', './default_dom'], function ($, controller, Helper, _, defaultDom) {

  function helpersDomInterface (controller) {

    controller.onInit(function () {

      if (this.dom === undefined)
        this.dom = this.constructor.dom()

      if (!(this.dom instanceof Helper))
        this.dom = this.dom.helper()

      this.constructor.domEvents().forEach(function (binding) {
        
        if (binding.length === 3) {
  
          (function (nodeName, event, fnName) {

            this.dom[nodeName].$.bind(event, this[fnName].bind(this))
          
          }).apply(this, binding)

        } else {
  
          (function (event, fnName) {

            this.dom.$.bind(event, this[fnName].bind(this))
          
          }).apply(this, binding)
  
        }

      }.bind(this))
    })

    controller.after('destroy', function () {
      this.dom.$.remove()
    })
  }

  controller.domInterface = helpersDomInterface

  return helpersDomInterface
})