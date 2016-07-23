var timeUtil=(function(){
  return{
    fn:function(number){
      return parseInt(number)<10?'0'+number:number;
    },
    sdCommondCallBack:function(time){
      (function(time,order){
        log.add(time,order.commond+' '+order.id+" 号飞船 命令发送成功");
        log.show();
      })(time);
    }
  };
})();
