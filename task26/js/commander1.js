/*单例模式*/
var Commander = (function() {
    var ships = {};
    var shipfactory = new ShipFactory();
    var mediator = Mediator;

    return {
        sendOrder: function(order) {
            mediator.send(order, this);
        },
        createShip: function(id) {
            var ship = shipfactory.createShip({
                id: id
            });
            ships["ship" + id] = ship;

            mediator.register(ship);
            var date = new Date();
            var hour = timeUtil.fn(date.getHours());
            var minute = timeUtil.fn(date.getMinutes());
            var seconds = timeUtil.fn(date.getSeconds());
            var time = date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate() + " " + hour + ":" + minute + ":" + seconds;
            log.add(time, "创建 " + id + " 号飞船");
            log.show();
            setTimeout(function() {
                ship.show();
                var btn=$('.control-4-ship-'+id).find('.launch-ship-btn');
                btn.attr('disabled',false);
            }, 1000);
        }
    };
})();
