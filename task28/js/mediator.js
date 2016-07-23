/*单例模式*/
var Mediator = (function() {
    var ships = {};
    var commander=null;
    var pip=[1,1,1,1,1,1,1,1,1,2];
    var dic={
      "launch":"启动",
      "stop":"停止",
      "create":"创建",
      "destory":"销毁"
    };
    return {
        signUp:function(leader){
          commander=leader;
        },
        register: function(ship) {
            ships[ship.id] = ship;
            ship.mediator = this;
        },
        send: function(order, from,callback) {
            //模拟丢包率
            var idx=Math.floor(Math.random()*11);
            var date=new Date();
            var hour=timeUtil.fn(date.getHours());
            var minute=timeUtil.fn(date.getMinutes());
            var seconds=timeUtil.fn(date.getSeconds());

            var time=date.getFullYear()+"."+(date.getMonth()+1)+"."+date.getDate()+" "+hour+":"+minute+":"+seconds;
            if(!from.sendOrder){
              //transmitter
              // console.log(order);
              commander.dataCenter.receiveSingnal(order);
            }else{
              while(pip[idx]!==1){
                log.add(time,"命令丢包,尝试重发");
                log.show();
                idx=Math.floor(Math.random()*11);
              }
              if(pip[idx]===1){
                //发送
                setTimeout(function(){
                  for (var key in ships) {
                      if (key !== from) {
                          ships[key].receiveSingnal(order);
                      }
                  }
                },300);
                callback&&callback(time);
              }
            }

        }
    };
})();
