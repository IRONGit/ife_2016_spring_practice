var Adapter = (function() {
    var adapter = function() {};
    var dicBin = {
        '0001': 'launch',
        '0010': 'stop',
        '0100': 'destory'
    };
    var dicJson = {
        'launch': '0001',
        'stop': '0010',
        'destory': '0100'
    };
    adapter.prototype = {
        binary2Json: function(bin) {
            if (bin.length === 8) {
                var id = parseInt(bin.slice(0, 4), 2);
                var order = bin.slice(4);

                order = dicBin[order];
                if (order === undefined) {
                    throw new Error('commond error');
                }

                return (function() {
                    return {
                        id: id,
                        commond: order
                    };
                })();
            }
        },
        Json2Binary: function(order) {
            var id = order.id;
            id = parseInt(id).toString(2);
            var commond = order.commond;
            commond = dicJson[commond];
            if (commond === undefined) {
                throw new Error('commond error');
            }
            var bin = id + commond;

            var length = bin.length;
            if (length < 8) {
                for (var i = 0; i < 8 - length; i++) {
                    bin = '0' + bin;
                }
            }
            return (function() {
                return {
                    bin: bin
                };
            })();
        }
    };
    return {
        adapter: adapter
    };
})();
