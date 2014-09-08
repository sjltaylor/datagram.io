if(typeof define!=='function'){var define=require('amdefine')(module);}

define(['jquery', 'bamboo/type'], function ($, Type) {

  var JQuerySubscription = Type.sub('JQuerySubscription')
                              .prototype
                                .onInit(function (args) {
                                  this.extend(args)
                                }) 
                                .extend({
                                  cancel: function () {
                                    this.$.unbind(this.eventName, this.callback)
                                  }
                                })
                              .constructor

  function activate () {
    this.$.bind(this.eventName, this.callback)
  }

  function subscribe (fwd, jquery, eventName, callback) {
    
    if (!(jquery instanceof $)) return fwd.call(this, jquery, eventName, callback)
    
    var subscription = new JQuerySubscription({
      $: jquery,
      eventName: eventName,
      callback: callback.bind(this)
    })

    activate.call(subscription)

    this.after('destroy', subscription.cancel.bind(subscription))

    return subscription
  }

  return function (obj) {
    obj.around('subscribe', subscribe)
  } 
})
