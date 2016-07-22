var timeUtil=(function(){
  return{
    fn:function(number){
      return parseInt(number)<10?'0'+number:number;
    }
  };
})();
