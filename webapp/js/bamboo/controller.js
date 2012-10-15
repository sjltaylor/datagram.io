if(typeof define!=='function'){var define=require('amdefine')(module);}

define(['./type', './controller/dom_events', './controller/app_events', './controller/default_dom', './controller/app'], function (Type, appEvents, domEvents, defaultDom, app) {

  function controller (obj) {
    
    obj.onInit(function (args) {

      for (var name in args)
        this[name] = args[name]
    })
  }

  // don't call this function 'define'! causes problems in a requirejs optimized build
  function defineController (name) {
    
    var Controller = Type.sub(name)
      .prototype
        .use(controller)
        .use(app)
        .use(controller.domInterface)
      .constructor
        .use(defaultDom)
        .use(domEvents)
        .use(appEvents)

    return Controller
  }

  controller.define  = defineController

  return controller
})
