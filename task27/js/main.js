$(function() {
    var commander = Commander;
    var powdic = [{
        speed: 30,
        consume: 5
    }, {
        speed: 50,
        consume: 7
    }, {
        speed: 80,
        consume: 9
    }];
    var energydic = [2, 3, 4];
    $('input[class=option-select]').change(function(e) {
        e.stopPropagation();
        if ($('input:radio:checked').length === 2) {
            $('input[class=create-ship-btn]').attr("disabled", false);
        }
    });


    $('.controller').on('click', 'input', function(e) {
        e.stopPropagation();
        var $target = $(e.target);
        var className = $target.attr("class");
        var shipId = $target.parent().attr("data");
        var id = parseInt(shipId.slice(shipId.indexOf("-") + 1));
        var order;
        if (className === "create-ship-btn") {
            var power = powdic[$('input:radio:checked')[0].id.slice(-1) - 1];
            var energy = energydic[$('input:radio:checked')[1].id.slice(-1) - 4];
            commander.createShip(id, power, energy);

            //重新设置初始位置
            var trace = $('.track-' + id).css("transform", "rotate(0deg)");
            $('.ship-' + id).find('span').text('100%');
            $target.attr({
                "value": "销毁飞船",
                "class": "destory-ship-btn"
            });

        } else {
            if (className === 'destory-ship-btn') {
                $target.attr({
                    "value": "创建飞船",
                    "class": "create-ship-btn"
                });
                order = {
                    id: id,
                    commond: 'destory'
                };
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
                order = {
                    id: id,
                    commond: 'launch'
                };
            } else if (className === 'stop-ship-btn') {
                $target.attr({
                    "value": "启动飞船",
                    "class": "launch-ship-btn"
                });
                order = {
                    id: id,
                    commond: 'stop'
                };
            } else {
                throw new Error('button type error');
            }

            commander.sendOrder(order, function(time) {
                (function(time) {
                    log.add(time, order.commond + ' ' + order.id + " 号飞船 命令发送成功");
                    log.show();
                })(time);
            });
        }

    });

});
