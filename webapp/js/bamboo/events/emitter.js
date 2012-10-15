if(typeof define!=='function'){var define=require('amdefine')(module);}


define(['bamboo/type'], function (Type) {

  var subscriptionId = 0

  var Subscription = Type.sub('Subscription')

  Subscription.prototype.onInit(function (args) {
    this.extend(args)
  }).extend({
    cancel: function () {
      var emitCallbacks = emitCallbacksFor.call(this.emitter, this.eventName)
      delete emitCallbacks[this.subscriptionId]
    }
  })

  function activate () {
    
    var emitCallbacks = emitCallbacksFor.call(this.emitter, this.eventName),
        eventName     = this.eventName

    emitCallbacks[this.subscriptionId] = this
  }

  function emitCallbacksFor (eventName) {
    this.emitCallbacks[eventName] = this.emitCallbacks[eventName] || {}
    return this.emitCallbacks[eventName]
  }

  function emit (eventName) {
    
    var args = Array.prototype.slice.call(arguments, 1)

    for (var subscriptionId in this.emitCallbacks[eventName])
      emitCallbacksFor.call(this, eventName)[subscriptionId].callback.apply(undefined, args)
  }

  function on (eventName, callback) {
    
    var subscription = new Subscription({
      subscriptionId: ++subscriptionId,
      eventName:      eventName,
      callback:       callback, 
      emitter:        this
    })

    activate.call(subscription)    

    return subscription
  }

  return function (obj) {
    
    obj.extend({
      isEmitter: true,
      emit: emit,
      on:   on
    })

    obj.onInit(function () {
      this.emitCallbacks = {}
    })  
  } 
})