$(function() {
    var commander = Commander;

    $('.controller').on('click', 'input', function(e) {
        e.stopPropagation();
        var $target = $(e.target);
        var className = $target.attr("class");
        var shipId = $target.parent().attr("data");
        var id = parseInt(shipId.slice(shipId.indexOf("-") + 1));

        if (className === "create-ship-btn") {
            commander.createShip(id);
            //重新设置初始位置
            var trace = $('.track-' + id).css("transform", "rotate(0deg)");
            $target.attr({
                "value": "销毁飞船",
                "class": "destory-ship-btn"
            });

        } else if (className === 'destory-ship-btn') {
            $target.attr({
                "value": "创建飞船",
                "class": "create-ship-btn"
            });
            commander.sendOrder({
                id: id,
                commond: 'destory'
            });
            var idx = id - 1;
            var next = $target.next("input");
            next.attr({
                value: "启动飞船",
                class: 'launch-ship-btn'
            });
        } else if (className === 'launch-ship-btn') {
            $target.attr({
                "value": "停止飞船",
                "class": "stop-ship-btn"
            });
            //启动飞船
            commander.sendOrder({
                id: id,
                commond: 'launch'
            });
        } else if (className === 'stop-ship-btn') {
            $target.attr({
                "value": "启动飞船",
                "class": "launch-ship-btn"
            });
            commander.sendOrder({
                id: id,
                commond: 'stop'
            });
        } else {
            throw new Error('button type error');
        }
    });

});
