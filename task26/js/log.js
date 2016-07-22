var log=(function(){
  /*
    [{
      time:msg,
      time:msg
    }]
  */
  var log=[];
  return{
    add:function(time,msg){
      log.push({
        time:time,
        msg:msg
      });
    },
    show:function(){
      var out=log[log.length-1];
      var msg=$("<p><span>"+out.time+"</span>&nbsp;"+out.msg+"</p>");
      $('.console-entity').append(msg);
      msg[0].scrollIntoView();
    }
  };
})();
