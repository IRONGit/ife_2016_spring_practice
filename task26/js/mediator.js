/*单例模式*/
var Mediator = (function() {
    var ships = {};
    var pip=[1,1,1,1,1,1,1,2,2,2];
    var dic={
      "launch":"启动",
      "stop":"停止",
      "create":"创建",
      "destory":"销毁"
    };
    return {
        register: function(ship) {
            ships[ship.id] = ship;
            ship.mediator = this;
        },
        send: function(order, from) {
            var idx=Math.floor(Math.random()*11);
            var date=new Date();
            var hour=timeUtil.fn(date.getHours());
            var minute=timeUtil.fn(date.getMinutes());
            var seconds=timeUtil.fn(date.getSeconds());

            var time=date.getFullYear()+"."+(date.getMonth()+1)+"."+date.getDate()+" "+hour+":"+minute+":"+seconds;

            if(pip[idx]===1){
              //发送
              for (var key in ships) {
                  if (key !== from) {
                      ships[key].receiveSingnal(order);
                  }
              }
              log.add(time,dic[order.commond]+order.id+"号飞船");
            }else{
              //丢包
              log.add(time,dic[order.commond]+order.id+"号飞船 命令丢包");
            }
            log.show();
        }
    };
})();
