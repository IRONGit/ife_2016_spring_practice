(function() {
    var Utils = (function() {
        return {
            addHandler: function(element, event, handler) {
                if (element.addEventListener) {
                    element.addEventListener(event, handler, false);
                } else if (element.attachEvent) {
                    element.attachEvent('on' + event, handler);
                } else {
                    element["on" + event] = handler;
                }
                return this;
            },
            removeHandler: function() {
                if (element.removeEventListener) {
                    element.removeEventListener(event, handler, false);
                } else if (element.detachEvent) {
                    element.detachEvent("on" + event, handler);
                } else {
                    element["on" + event] = "";
                }
                return this;
            }
        }
    })();



    function queue() {
        this.data = [];
        this.leftInBtn = document.getElementById('left-in');
        this.leftOutBtn = document.getElementById('left-out');
        this.rightInBtn = document.getElementById('right-in');
        this.rightOutBtn = document.getElementById('right-out');
        this.textArea = document.getElementById('text');
        this.box = document.getElementsByClassName('box')[0];

        this.wrapper = document.getElementsByClassName('wrapper')[0];
        var me = this;
        Utils.addHandler(this.leftInBtn, 'click', function(e) {
            //左侧入
            me.leftIn(parseInt(me.textArea.value));
        }).addHandler(this.leftOutBtn, 'click', function(e) {
            //左侧出
            me.leftOut();
        }).addHandler(this.rightInBtn, 'click', function(e) {
            //右侧入
            me.rightIn(parseInt(me.textArea.value));
        }).addHandler(this.rightOutBtn, 'click', function(e) {
            //右侧出
            me.rightOut();
        });
    }

    queue.prototype = {
        leftIn: function(number) {
            this.data.unshift(number);
            this.insertFromLeft(number);
        },
        leftOut: function() {
            this.data.shift();
            this.removeFirst();
        },
        rightIn: function(number) {
            this.data.push(number);
            this.insertFromRight(number);
        },
        rightOut: function() {
            this.data.pop();
            this.removeLast();
        },
        insertFromLeft: function(number) {
            var oldItem  = document.getElementsByClassName('number')[0];
            var newItem = document.createElement("div");

            newItem.className = "number";
            newItem.innerText = number;

            this.box.insertBefore(newItem, oldItem);
        },
        removeFirst: function() {
            var doc = document.getElementsByClassName('number');
            if (doc.length) {
                this.box.removeChild(doc[0]);
            }
        },
        insertFromRight: function(number) {
            var doc = document.getElementsByClassName('box');
            if (doc.length) {
                var newItem = document.createElement('div');

                newItem.className = "number";
                newItem.innerText = number;

                doc[0].appendChild(newItem);
            }
        },
        removeLast: function() {
            var doc = document.getElementsByClassName('number');
            if (doc.length) {
                this.box.removeChild(doc[doc.length - 1]);
            }
        }
    }
    var queue = new queue();
})();
