if(typeof define!=='function'){var define=require('amdefine')(module);}

define(['jquery', 'bamboo/string'], function ($) {

  var templates = {}

  function init () {
    
    $('script[type="text/template"]').each(function (i, element) {

      var name = element.id.toCamelCase().match(/(.*)Template$/)[1];

      templates[name] = function () {
        return $(element.innerHTML);
      }
    });
  }

  $(document).ready(init);

  return templates
})