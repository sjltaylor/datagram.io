if(typeof define!=='function'){var define=require('amdefine')(module);}

define(function(){

  return {
    handler: function(){
      if(!this._handler){
        this._handler = this.generateHandler(this)
      }
      return this._handler
    },

    setHandler: function(handler){
     this._handler = handler
    },

    generateHandler: function(){
      throw("you need to set generateHandler or use setHandler explicitly")
    }
  }

})
