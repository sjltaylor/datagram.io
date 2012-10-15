if(typeof define!=='function'){var define=require('amdefine')(module);}

define(['jquery', 'bamboo/type', 'bamboo/events/emitter', 'bamboo/events/subscriber', './index', './query', './relation'], function ($, Type, emitter, subscriber, Index, Query, relation) {
  
  function init (attrs) {
    this.attributes = {}
    this.changes    = {}
    if (attrs) this.set(attrs)
    this.constructor.emit('add', this)
  }

  function ctorInit () {
    this.index = new Index(this, 'id')
    this.all = this.index.all
  }

  var instance = {
    set: function () {
      
      var changes

      if (arguments.length == 2) {
        changes = {}
        changes[arguments[0]] = arguments[1]
        return this.set(changes)
      } else {
        changes = arguments[0]
      }

      var modelChanged = false

      for (var name in changes) {
        
        var value    = changes[name],
            prev     = this.get(name),
            changed  = value !== prev

        if (changed) {
          
          if (name in this.attributes) {
            this.changes[name] = value
            this.emit('change:' + name, this.attributes[name], value)
          } else {
            this.attributes[name] = value
            this.emit('change:' + name, undefined, value)
          }          
        }

        modelChanged = modelChanged || changed
      }
      
      if (modelChanged) {
        this.emit('change')
      }
      
      return modelChanged
    },
    get: function (name) {
      return (name in this.changes) ? this.changes[name] : this.attributes[name]
    },
    attrs: function () {
      
      var keys = arguments.length ? arguments : Object.keys(this.attributes)
      
      var attrs = {}
      
      for(var i = 0; i < keys.length; i++)
        attrs[keys[i]] = this.get(keys[i])

      return attrs
    },
    hasChanges: function () {
      return !!Object.keys(this.changes).length
    },
    hasKey: function () {
      return (this.constructor.index.keyName() in this.attributes)
    },
    commit: function () {
      
      var committed = false

      for (var name in this.changes) {
        this.attributes[name] = this.changes[name]
        this.emit('commit:' + name)
        delete this.changes[name]
        committed = true
      }

      if (committed) 
        this.emit('commit')
    },
    reset: function () {
      var reset = false

      for (var name in this.changes) {
        this.emit('change:' + name, this.get(name), this.attributes[name])
        delete this.changes[name]
        reset = true
      }

      if (reset) 
        this.emit('change')
    },
    destroy: function () {
      this.emit('destroy')
      this.constructor.emit('remove', this)
    }
  }

  var ctor = {

    each: function (fn) {
      this.index.all.each(fn)
      return this
    },
    primaryKey: function (name) {
      this.index.rebuild(name)
      return this
    },
    find: function (pk) {
      return this.index.find(pk)
    },
    load: function (attrs) {
      
      var model = this.find(attrs[this.index.keyName()])
        
      if (model) {
        model.set(attrs)
        return model
      }

      model = new this(attrs)

      return model
    },
    populate: function () {

      if ($.isArray(arguments[0])) return this.populate.apply(this, arguments[0])

      for (var i = 0; i < arguments.length; i++)
        this.load(arguments[i])

      return this
    },
    withKey: function () {
      return this.where('hasKey')
    }
  }

  return Type.sub('Model')
    .prototype
      .use(emitter)
      .use(subscriber)
      .extend(instance)
      .onInit(init)
    .constructor
      .use(Query.queryable)
      .use(emitter)
      .use(relation)
      .extend(ctor)
      .onInit(ctorInit)
})