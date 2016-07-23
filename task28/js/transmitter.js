var Transmitter=(function(){
  var transmitter=function(){
    this.mediator = Mediator;
  };
  transmitter.prototype={
    transmit:function(data){
      this.mediator.send(data,this);
    }
  };
  return{
    transmitter:transmitter
  };
})();
