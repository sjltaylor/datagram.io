if(typeof define!=='function'){var define=require('amdefine')(module);}

define(['jquery', './model', './query'], function ($, Model, Query) {
  
  var lookup
  
  function interceptAssociatedAttribute (attrName, modelName) {

    this.prototype.around('set', function (set) {

      var attrs

      if (typeof arguments[1] === 'string') {
        attrs = {}
        attrs[arguments[1]] = arguments[2]
      } else {
        attrs = $.extend({}, arguments[1])
      }

      if (attrName in attrs) {
        var RelatedModel = lookup[modelName]
        RelatedModel.populate(attrs[attrName])
        delete attrs[attrName]
      } 

      return set(attrs)
    })
  }

  function hasMany (key, associationConfig) {

    var predicateName = 'belongsTo' + associationConfig.model + ':' + key

    
    var association = {}
    
    association[key] = function () {
      var keyName =  associationConfig.key || this.constructor.index.keyName()
      var RelatedModel = lookup[associationConfig.model]

      if (!(predicateName in RelatedModel.prototype)) {
        var relatedModelPredicate = {}

        relatedModelPredicate[predicateName] = function (m, keyName) {
            
          var foreignKey = this.get(associationConfig.foreignKey),
              key        = m.get(keyName)
            
            return key == foreignKey
        }

        RelatedModel.prototype.extend(relatedModelPredicate)    
      }

      return RelatedModel.where(predicateName, this, keyName)
    }

    this.prototype.extend(association)

    interceptAssociatedAttribute.call(this, key, associationConfig.model)

    return this
  }

  function hasOne (key, associationConfig) {

    var predicateName = 'belongsTo' + associationConfig.model + ':' + key

    var association = {}
    
    association[key] = function () {
      
      var primaryKeyName = associationConfig.key || this.constructor.index.keyName()
      var RelatedModel = lookup[associationConfig.model]

      if (!(predicateName in RelatedModel.prototype)) {
        var relatedModelPredicate = {}

        relatedModelPredicate[predicateName] = function (m, primaryKeyName) {

          return m.get(associationConfig.foreignKey) == this.get(primaryKeyName)
        }

        RelatedModel.prototype.extend(relatedModelPredicate)
      }

      return RelatedModel.where(predicateName, this, primaryKeyName).single()
    }

    this.prototype.extend(association)

    interceptAssociatedAttribute.call(this, key, associationConfig.model)

    return this
  }

  function belongsTo (key, associationConfig) {

    var predicateName = 'hasA' + associationConfig.model + ':' + key

    var association = {}
    
    association[key] = function () {
      
      var RelatedModel = lookup[associationConfig.model]
      var primaryKeyName = associationConfig.key || RelatedModel.index.keyName()
      
      if (!(predicateName in RelatedModel.prototype)) {
        var relatedModelPredicate = {}

        relatedModelPredicate[predicateName] = function (m, primaryKeyName) {
          var key = this.get(primaryKeyName)
          return key == m.get(associationConfig.foreignKey)
        }

        RelatedModel.prototype.extend(relatedModelPredicate)                    
      }

      return RelatedModel.where(predicateName, this, primaryKeyName).single()
    }

    this.prototype.extend(association)

    interceptAssociatedAttribute.call(this, key, associationConfig.model)

    return this
  }

  function relation (ctor) {

    if (lookup) throw new Error('relation plugin has already been plugged in')

    lookup = {}

    ctor.onInit(function () {
      lookup[this.name] = this
    })

    ctor.extend({
      hasMany:   hasMany,
      belongsTo: belongsTo,
      hasOne: hasOne
    })
  }

  return relation
})