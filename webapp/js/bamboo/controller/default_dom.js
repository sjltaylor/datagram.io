if(typeof define!=='function'){var define=require('amdefine')(module);}

define(['jquery'], function ($) {

  return function defaultDom (Ctor) {
    Ctor.extend({
      dom: function (cb) {
        
        if (cb === undefined) {
          return ('__domCb__' in this) ? this.__domCb__() : $('<div>')
        } else {
          this.__domCb__ = (typeof cb === 'function') ? cb : function(){return $(cb)}
        }

        return this
      }
    })
  }
})