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
          if(typeof bin==='object'){
            bin=bin.bin;
          }
          var length=bin.length;
          var id = parseInt(bin.slice(0, 4), 2);
            if (length === 8) {
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
            }else if(length===16){
              var state = bin.slice(4,8);
              state=dicBin[state];
              if(state===undefined){
                throw new Error('commond error');
              }
              var energy=bin.slice(8);
              energy=parseInt(energy,2);
              return (function(){
                return{
                  id:id,
                  state:state,
                  energy:energy
                };
              })();
            }
        },
        Json2Binary: function(order) {
            if (!order) {
                return;
            }
            var id, commond, state, energy;
            var length;
            var bin;
            var i;
            if (order.id && order.commond) {
                id = order.id;
                id = parseInt(id).toString(2);
                commond = order.commond;
                commond = dicJson[commond];
                if (commond === undefined) {
                    throw new Error('commond error');
                }
                bin = id + commond;
                length = bin.length;
                if (length < 8) {
                    for (i = 0; i < 8 - length; i++) {
                        bin = '0' + bin;
                    }
                }
            }
            //0010为停止，0001为飞行，1100表示即将销毁
            if (order.id && order.state && order.energy) {
                id = order.id;
                id = parseInt(id).toString(2);
                state = order.state;
                state = dicJson[state];
                energy = order.energy;
                energy = parseInt(energy).toString(2);
                var prefix = this.fix(id + state, 8);
                energy = this.fix(energy,8);
                bin = prefix + energy;
            }
            return (function() {
                return {
                    bin: bin
                };
            })();
        },
        fix: function(data, digit) {
            digit = digit || 8;
            var length = data.length;
            if (length < digit) {
                for (i = 0; i < digit - length; i++) {
                    data = '0' + data;
                }
            }
            return data;
        }
    };
    return {
        adapter: adapter
    };
})();
