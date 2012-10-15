if(typeof define!=='function'){var define=require('amdefine')(module);}

define(['bamboo/type', 'bamboo/events/emitter', 'bamboo/events/subscriber', './query', './map'], function (Type, emitter, subscriber, Query, Map) {

  var nextUid = 1

  function init (collection, keyName) {

    this.__keyname__    = keyName
    this.__keymap__     = new Map
    this.__uidmap__     = new Map
    this.__collection__ = collection

    this.all = {
      __keymap__: this.__uidmap__,
      find: this.find,
      each: this.each
    }

    this.subscribe(collection, 'add', function (model) {
      add.call(this, model)
    })

    this.subscribe(collection, 'remove', function(model) {
      remove.call(this, model)
    })

    this.subscribe(this.__keymap__, 'add', function (stash, key) {
      this.emit('add', stash.model)
    })

    this.subscribe(this.__keymap__, 'remove', function (stash, key) {
      this.emit('remove', stash.model)
    })
  }

  function add (model) {

    if (!('uid' in model)) model.uid = nextUid++
    
    var key    = model.get(this.__keyname__), 
        keymap = this.__keymap__, 
        uidmap = this.__uidmap__

    var stash = uidmap.get(model.uid) || { model: model }
    uidmap.add(model.uid, stash)
    
    if (key !== undefined) keymap.add(key, stash)

    if (!stash.subscription) {

      stash.subscription = this.subscribe(model, 'change:' + this.__keyname__, function (from, to) {
        if (keymap.has(from)) 
          keymap.remap(from, to)
        else
          keymap.add(to, uidmap.get(model.uid))
      })
    }    
  }

  function find (key) {
    var stash = this.__keymap__.get(key)
    if (stash) return stash.model
  }

  function remove (model) {
    this.__keymap__.remove(model.get(this.__keyname__))
    var stash = this.__uidmap__.remove(model.uid)
    if (stash) stash.subscription.cancel()
  }

  function each (fn) {
    this.__keymap__.each(function (stash, key) {
      fn(stash.model, key)
    })
  }

  function rebuild (key) {
    this.each(remove.bind(this))
    this.__keyname__ = key || this.__keyname__
    this.__collection__.each(add.bind(this))
  }

  function keyName () {
    return this.__keyname__
  }

  return Type.sub('Index')
    .prototype
      .use(emitter)
      .use(subscriber)
      .use(Query.queryable)
      .onInit(init)
      .extend({
        find:    find,
        each:    each,
        rebuild: rebuild,
        keyName: keyName
      })
    .constructor
})