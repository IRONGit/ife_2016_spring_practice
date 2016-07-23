/*单例模式*/
var Commander = (function() {
    var ships = {};
    var shipfactory = new ShipFactory();
    var mediator = Mediator;
    // var adapter=new Adapter.adapter();
    var datacenter=dataCenter;
    mediator.signUp(this);
    return {
        sendOrder: function(order,callback) {
            // order=adapter.Json2Binary(order).bin;
            datacenter.sendOrder(order,callback);
            // mediator.send(order, this,callback);
        },
        createShip: function(id,power,energy) {
            var option={
                id: id,
                speed:power.speed,
                powerDownSpeed:power.consume,
                powerUpSpeed:energy
            };
            var ship = shipfactory.createShip(option);
            ships["ship" + id] = ship;

            mediator.register(ship);
            var date = new Date();
            var hour = timeUtil.fn(date.getHours());
            var minute = timeUtil.fn(date.getMinutes());
            var seconds = timeUtil.fn(date.getSeconds());
            var time = date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate() + " " + hour + ":" + minute + ":" + seconds;
            log.add(time, "创建 " + id + " 号飞船");
            log.show();
            datacenter.renderUI(option);
            setTimeout(function() {
                ship.show();
                var btn=$('.control-4-ship-'+id).find('.launch-ship-btn');
                btn.attr('disabled',false);
            }, 1000);
        }
    };
})();
