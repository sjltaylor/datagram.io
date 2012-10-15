if(typeof define!=='function'){var define=require('amdefine')(module);}

define(['jquery', 'bamboo/string', 'bamboo/object'], function ($, string, object) {

  $.ajaxSetup({
    beforeSend: function(xhr) {
      xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
    }
  })

  // https://github.com/jquery/jquery/blob/master/src/ajax.js:355
  // http://api.jquery.com/jQuery.ajax/
  function parseToCamelCasedJSON (string) {
    var data = JSON.parse(string)
    // transform underscored_names to lowerCamelCase
    object(data).convertKeycase('toCamelCase')

    return data
  }

  var converters = $.extend({}, $.ajaxSettings.converters, {
    "text json": parseToCamelCasedJSON
  })

  function convertPayload (obj) {

    var data = $.extend(true, {}, obj)

    object(data).convertKeycase('toUnderscoreCase')

    return data
  }

  var defaultOptions = {
    dataType:    'json',
    converters:  converters,
    contentType: 'application/json'
  }
  
  return {
    
    endpoint: function (httpRequestType, opts) {
      
      return function () {

        var url = (typeof opts.url) === 'function' ? opts.url.apply(this, arguments) : opts.url
        // assume opts.url is a string or the a function that has returned a string

        if (!url.match(/\.json$/i)) {
          url = url + '.json'
        }

        var payload = ('payload' in opts) ? opts.payload.apply(this, arguments) : {}
        
        payload = convertPayload(payload)
        
        switch (httpRequestType.toUpperCase()) {
          case 'POST':
          case 'PUT':
          case 'PATCH':
          case 'DELETE':
            payload = JSON.stringify(payload)
           
          default:
        }

        var ajaxOptions = $.extend({}, defaultOptions, { 
          type: httpRequestType, 
          data: payload 
        })

        return $.ajax(url, ajaxOptions)
      }
    }
  }
})
