if(typeof define!=='function'){var define=require('amdefine')(module);}

define(['bamboo/type', 'bamboo/events/emitter', 'bamboo/events/subscriber'], function (Type, emitter, subscriber) {
  
  var Query = Type.sub('Query')

  function init (collection, predicateName, parameters) {
    
    this.store = {}

    this.collection = collection
    this.parameters = parameters || []
    this.predicateName = predicateName

    this.predicate = function (candidate) {
      return candidate[predicate].apply(candidate, Array.prototype.slice.call(arguments, 1))
    }

    this.collection.each(watch.bind(this))

    this.subscribe(this.collection, 'add',    onAddedToParent)
    this.subscribe(this.collection, 'remove', onRemovedFromParent)


    this.parameters.forEach(function (parameter) {
      if (parameter.isEmitter) {
        this.subscribe(parameter, 'change', retestCollection.bind(this))
      }
    }.bind(this))
  }

  function watch (model) {
    
    this.store[model.uid] = {
      model: model,
      isMatch: isMatch.call(this, model),
      changeSubscription: this.subscribe(model, 'change', retest.bind(this, model)) 
    }
  }

  function unwatch (model) {
    this.store[model.uid].changeSubscription.cancel()
    delete this.store[model.uid]
  }

  function retest (model) {

    var state = this.store[model.uid]
    var isNowMatch = isMatch.call(this, model)

    if (isNowMatch !== state.isMatch) {
      state.isMatch = isNowMatch
      this.emit(isNowMatch ? 'add' : 'remove', model)
    }
  }

  function retestCollection () {
    this.collection.each(retest.bind(this))
  }

  function isMatch(model) {
    return model[this.predicateName].apply(model, this.parameters)
  }

  function onAddedToParent (model) {
    
    watch.call(this, model)

    if (isMatch.call(this, model))
      this.emit('add', model)
  }

  function onRemovedFromParent (model) {
    
    unwatch.call(this, model)

    if (isMatch.call(this, model))
      this.emit('remove', model)
  }

  function each (fn) {
  
    for (var uid in this.store) {
      var stored = this.store[uid]
      if (stored.isMatch) {
        fn(stored.model)
      }
    }

    return this
  }

  function where (predicate) {
    return new Query(this, predicate, Array.prototype.slice.call(arguments, 1))
  }

  function toArray () {
    var array = []
    this.each(function (e) {
      array.push(e)
    })
    return array
  }

  function single () {
    var array = this.toArray()
    if (array.length > 1) throw new Error('Cannot use single() when the number of matches is: ' + array.length)
    return array[0]
  }

  function queryable (obj) {
    obj.extend({
      where:   where,
      toArray: toArray,
      single: single
    })
  }

  return Query
    .prototype
      .use(subscriber)
      .use(emitter)
      .use(queryable)
      .onInit(init)
      .extend({
        each: each
      })
    .constructor
      .extend({
        queryable: queryable
      })
})