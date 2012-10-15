if(typeof define!=='function'){var define=require('amdefine')(module);}

define(['jquery', 'bamboo/type', 'bamboo/string'], function ($, Type, string) {

  var ObjectFunctions = Type.sub('ObjectFunctions')
    .prototype
      .extend({
        init: function (object) {
          this.object = object
        },
        slice: function () {
          
          if ($.isArray(arguments[0])) 
            return this.slice.apply(this, arguments[0])

          var slice = {}
            
          for (var i = 0; i < arguments.length; i++)
            slice[arguments[i]] = this.object[arguments[i]]
            
          return slice
        },
        /* recursively visits objects members  */
        traverse: function (visitor) {

          for (var name in this.object) {
            
            var value = this.object[name]

            visitor(value, name, this.object)
            
            if ((typeof value) === 'object')
              object(value).traverse(visitor)        
          }
        },
        convertKeycase: function (toNewKeycase) {
          this.traverse(function (value, name, object) {
            if (!$.isArray(object)) {
              delete object[name]
              object[name[toNewKeycase]()] = value
            }
          })
          return this.object
        }
      })
    .constructor

  function object (o) {
    return new ObjectFunctions(o)
  }

  object.ObjectFunctions = ObjectFunctions

  return object
})