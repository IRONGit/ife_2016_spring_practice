var dataCenter = (function() {
    var adapter = new Adapter.adapter();
    var mediator = Mediator;
    var powerDic = {
        "30,5": "前进号",
        "50,7": "奔腾号",
        "80,9": "超越号"
    };
    var energyDic = {
        2: "劲量型",
        3: "光能型",
        4: "永久型"
    };
    var stateDic={
      "launch":"飞行中",
      "stop":"停止",
      "destory":"即将销毁"
    };
    return {
        receiveSingnal: function(data) {
            data = adapter.binary2Json(data);
            //显示在屏幕中
            this.renderData(data);
        },
        sendOrder: function(order, callback) {
            order = adapter.Json2Binary(order).bin;
            mediator.send(order, this, callback);
        },
        renderData: function(data) {
            var id = data.id;
            var state = data.state;
            var energy = data.energy;

            var trs = $('.monitor-wrapper table tbody ').find('tr td:nth-child(1)');
            var tr;
            trs.each(function(index, element) {
                if ($(element).text() === id + "号") {
                    tr = $('.monitor-wrapper table tbody tr').eq(index);
                    tr.children('td').eq(3).text(stateDic[state]);
                    tr.children('td').eq(4).text(energy + "%");
                }
            });
            if (state === 'destory') {
                //即将销毁
                setTimeout(function() {
                    tr.remove();
                }, 1000);
            }
        },
        renderUI: function(option) {
            var id = option.id;
            var power = powerDic[option.speed + "," + option.powerDownSpeed];
            var energy = energyDic[option.powerUpSpeed];
            var monitor = $('.monitor-wrapper tbody');
            var data = $('<tr><td>' + id + '号</td><td>' + power + '</td><td>' + energy + '</td><td>连接中..</td><td>100%</td></tr>');
            monitor.append(data);
        }
    };
})();
