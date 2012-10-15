if(typeof define!=='function'){var define=require('amdefine')(module);}

define(function () {

  String.prototype.toCamelCase = function () {
    
    return this.replace(/((\s|-|_)(\w))/g, function(match) {
      return match[1].toUpperCase()
    })
  }

  String.prototype.toLowerCamelCase = function () {
    var s = this.toCamelCase()
    return s ? s[0].toLowerCase() + s.slice(1) : s
  }

  // adapted from http://stackoverflow.com/questions/6857552/regular-expression-in-crockfords-string-supplant
  String.prototype.supplant = function (dictionary) {
    return this.replace(/{([^{}]*)}/g, function (target, name) {

      var replacement = dictionary[name];

      if (typeof replacement === 'function')
        replacement = replacement()

      return typeof replacement === 'string' || 
             typeof replacement === 'number' || 
             typeof replacement === 'boolean' 
             ? replacement : target
    })
  }

  String.prototype.toUnderscoreCase = function () {
    return this.replace(/([a-z])([A-Z])/g, function(match, group1, group2) {
      return group1 + '_' + group2.toLowerCase()
    })
  }

  return function string (s) {
    return s
  }
})