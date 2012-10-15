if(typeof define!=='function'){var define=require('amdefine')(module);}

define(['jquery', './helper'], function ($, Helper) {
  
  function traverse (h, jquery) {

    jquery.children().each(function () {
      
      var thi$ = $(this),
          name = thi$.data().helperName

      if (name) {

        h[name] = new Helper(thi$)

        traverse(h[name], thi$)
      
      } else {

        traverse(h, thi$)
      }      
    })
  }

  $.fn.helper = function () {

    var h = new Helper(this)

    traverse(h, h.$)

    return h
  }
})


  