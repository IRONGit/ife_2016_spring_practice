(function() {
    /*飞船由以下系统组成:
      1.动力系统
      2.能源系统
      3.信号接收处理系统
      4.自爆系统
    */

    /*动力系统: 完成停止和飞行两个行为*/
    var powerSystem = function(settings, energySys) {
        $.extend(this.DEFAULTS, settings || {});
        this.shipid = this.DEFAULTS.shipid;
        this.angle = 0;

        //轨道
        this.track = $('.track-' + this.shipid);
        this.energySys = energySys;
        this.speed=this.DEFAULTS.speed;
        this.state=this.DEFAULTS.state;
        this.dic={
          80:8,
          50:5,
          30:3,
          20:2
        };
    };
    powerSystem.prototype = {
        DEFAULTS: {
            speed: 20,
            state: 'stop'
        },
        launch: function() {
            var me = this;
            var energySys = me.energySys;
            var curEnergy = energySys.curEnergy;
            var diff = energySys.diff;

            clearInterval(this.moveAnimation);
            this.state = 'launch';
            me.moveAnimation = setInterval(function() {
                //改变运动状态
                me.angle += me.dic[me.speed];
                // debugger
                me.angle %= 360;
                me.track.css("transform", "rotate(" + me.angle + "deg)");
                //改变燃料
                me.energySys.curEnergy -= diff;
                me.track.find('span').text(me.energySys.curEnergy + "%");
                if (me.energySys.curEnergy <= diff) {
                    me.stop();
                }
            }, 1000);
        },
        stop: function() {
            this.state = 'stop';
            clearInterval(this.moveAnimation);
            this.fillfuel();
        },
        fillfuel: function() {
            var me = this;
            var powerUpSpeed = me.energySys.powerUpSpeed;
            clearInterval(me.fillAnimation);
            me.fillAnimation = setInterval(function() {
                if (100 - me.energySys.curEnergy <= powerUpSpeed) {
                    powerUpSpeed = 100 - me.energySys.curEnergy;
                    clearInterval(me.fillAnimation);
                    if(me.state!=='stop'){
                      me.launch();
                    }
                }
                me.energySys.curEnergy += powerUpSpeed;
                me.track.find('span').text(me.energySys.curEnergy + "%");
            }, 1000);
        }
    };

    window.PowerSystem = powerSystem;


    /*能源系统:提供能源,并且可以利用太阳能充电*/
    var energySystem = function(settings) {
        $.extend(this.DEFAULTS, settings || {});
        this.diff = this.DEFAULTS.powerDownSpeed - this.DEFAULTS.powerUpSpeed;
        this.curEnergy = this.DEFAULTS.curEnergy;
        this.powerUpSpeed = this.DEFAULTS.powerUpSpeed;
    };
    energySystem.prototype = {
        DEFAULTS: {
            powerUpSpeed: 2,
            powerDownSpeed: 5,
            curEnergy: 100
        }
    };

    window.EnergySystem = energySystem;


    /*信号接收系统*/
    var singnalSystem = function(settings) {
        this.adapter=new Adapter.adapter();
        this.transmitter=new Transmitter.transmitter();
        $.extend(this.DEFAULTS, settings || {});
        this.shipid = this.DEFAULTS.shipid;
    };
    singnalSystem.prototype = {
        DEFAULTS: {},
        receiveSingnal: function(order, callback, pointer) {
            order=this.adapter.binary2Json(order);
            var param;
            if (order.id === this.shipid) {
                //判断这个指令是不是发给自己的
                switch (order.commond) {
                    case 'launch':
                        param = 'launch';
                        break;
                    case 'stop':
                        param = 'stop';
                        break;
                    case 'destory':
                        param = 'destory';
                        break;
                    default:
                        throw new Error('No command type');
                }
                callback && callback(param, pointer);
            }
        },
        transmit:function(data){
          var me=this;
          data=me.adapter.Json2Binary(data);
          me.transmitter.transmit(data);
        }
    };

    window.SingnalSystem = singnalSystem;

    /*自爆系统*/
    var destorySystem = function(settings) {
        $.extend(this.DEFAULTS, settings || {});
    };
    destorySystem.prototype = {
        DEFAULTS: {},
        destory: function(ship, powSys) {
            powSys.state='destory';
            clearInterval(powSys.moveAnimation);
            ship.hide();
        }
    };

    window.DestorySystem = destorySystem;


    var ship = function(settings) {
        this.settings = $.extend({}, this.DEFAULTS, settings);
        this.id = this.settings.id;
        this.mediator = null;
        this.ship = $('.ship-' + this.id).parent();
        // debugger
        /*初始化能源系统*/
        this.energySys = new EnergySystem({
          powerUpSpeed:this.settings.powerUpSpeed,
          powerDownSpeed:this.settings.powerDownSpeed
        });


        /*初始化动力系统*/
        this.powerSys = new PowerSystem({
            speed: this.settings.speed,
            state: this.settings.state,
            shipid: this.id
        }, this.energySys);

        /*初始化信号系统*/
        this.singnalSys = new SingnalSystem({
            shipid: this.settings.id
        });
        /*初始化自爆系统*/
        this.destorySys = new DestorySystem();
        this.state=this.powerSys.state;
        this.transmit();


    };
    ship.prototype = {
        DEFAULTS: {
            id: 1,
            state: "stop",
            speed: 30,
            powerUpSpeed: 2,
            powerDownSpeed: 5
        },
        executeOrder: function(fn, pointer) {
            //pointer指向当前对象,即ship
            switch (fn) {
                case 'launch':
                    pointer.launch();
                    break;
                case 'stop':
                    pointer.stop();
                    break;
                case 'destory':
                    pointer.destory();
                    break;
                default:
                    throw new Error('commond type error');
            }
        },
        receiveSingnal: function(order) {
            this.singnalSys.receiveSingnal(order, this.executeOrder, this);
        },
        show: function() {
            this.ship.show();
        },
        destory: function() {
          var me=this;
            this.destorySys.destory(this.ship, this.powerSys);
            $('div[data=ship-'+this.id+'] input').eq(1).attr('disabled','disabled');
            setTimeout(function(){
              clearInterval(me.transmitAnimation);
            },2000);
        },
        launch: function() {
            this.powerSys.launch();
        },
        stop: function() {
            this.powerSys.stop();
        },
        transmit:function(){
          var me=this;
          //0010为停止，0001为飞行，1100表示即将销毁
          me.transmitAnimation=setInterval(function(){
            var data={
              id:me.id,
              state:me.powerSys.state,
              energy:me.energySys.curEnergy
            };
            me.singnalSys.transmit(data);
          },1000);
        }
    };
    window.Ship = ship;
})();
