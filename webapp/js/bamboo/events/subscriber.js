if(typeof define!=='function'){var define=require('amdefine')(module);}

define(function () {

  function subscribe(emitter, eventName, callback) {

    if (emitter.isEmitter !== true) throw new Error('Cannot subscribe, first argument is not an emitter: ' + emitter)

    var subscription = emitter.on(eventName, callback.bind(this))

       this.after('destroy', subscription.cancel.bind(subscription))
    emitter.after('destroy', subscription.cancel.bind(subscription))

    return subscription
  }

  return function (obj) {

    obj.extend({
      subscribe: subscribe
    })
  } 
})
