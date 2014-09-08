define(['bamboo/type', 'bamboo/events/emitter'], function (Type, emitter) {
  
  
  function map (key, value) {
    
    if (key === undefined) throw new Error('cannot use undefined as a key')
      
    var alreadyMapped = (key in this.store)

    if (alreadyMapped && (this.store[key] !== value)) {
      throw new Error('Map already has entry with with key: ' + key)
    }

    this.store[key] = value

    return !alreadyMapped
  }

  function unmap (key) {
    var removed = this.store[key]
    delete this.store[key]
    return removed
  }

  function add (key, value) {
    
    var added = map.call(this, key, value)
   
    if (added) this.emit('add', value, key)

    return added
  }

  function remove (key) {
    
    var value = this.get(key)
    var removed = unmap.call(this, key)
    
    if (removed) this.emit('remove', value, key)
    
    return removed
  }

  function remap (oldKey, newKey) {
    map.call(this, newKey, this.store[oldKey])
    unmap.call(this, oldKey)
  }

  function get (key) {
    return this.store[key]
  } 

  function has (key) {
    return key in this.store
  }

  function each (fn) {
    for(var key in this.store) fn(this.store[key], key)
  }

  return Type.sub('Map')
    .prototype
      .use(emitter)
      .onInit(function () {
        this.store = {}
      })
      .extend({
        get: get,
        has: has,
        add: add,
        remove: remove,
        remap: remap,
        each: each
      })
    .constructor
})