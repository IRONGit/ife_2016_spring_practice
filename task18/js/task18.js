(function() {
    var Utils = (function() {
        return {
            addHandler: function(element, event, handler) {
                if (element.addEventListener) {
                    element.addEventListener(event, handler, false);
                } else if (element.attachEvent) {
                    element.attachEvent('on' + event, handler);
                } else {
                    element['on' + event] = handler;
                }
                return this;
            },
            removeHandler: function(element, event, handler) {
                if (element.removeEventListener) {
                    element.removeEventListener(event, handler, false);
                } else if (element.detachEvent) {
                    element.detachEvent('on' + event, handler);
                } else {
                    element['on' + event] = null;
                }
                return this;
            },
            getEvent: function(event) {
                return event ? event : window.event;
            },
            preventDefault: function(event) {
                if (event.preventDefault) {
                    event.preventDefault();
                } else {
                    event.returnValue = false;
                }
            },
            stopPropagation: function(event) {
                if (event.stopPropagation) {
                    event.stopPropagation();
                } else {
                    event.cancelBubble = true;
                }
            },
            getCharCode: function(e) {
                if (typeof e.charCode == 'number') {
                    return e.charCode;
                } else {
                    return e.keyCode;
                }
            },
            getClipboardText: function(e) {
                var clipboardData = e.clipboardData || window.clipboardData;
                return clipboardData.getData('text');
            },
            getTarget: function(event) {
                return event.target || event.srcElement;
            }
        }
    })();



    function queue() {
        var me = this;
        this.data = [];
        this.leftInBtn = document.getElementById('left-in');
        this.leftOutBtn = document.getElementById('left-out');
        this.rightInBtn = document.getElementById('right-in');
        this.rightOutBtn = document.getElementById('right-out');
        this.textArea = document.getElementById('text');
        this.box = document.getElementsByClassName('box')[0];

        this.wrapper = document.getElementsByClassName('wrapper')[0];


        Utils.addHandler(this.wrapper, 'click', function(e) {
            e = Utils.getEvent(e);

            Utils.preventDefault(e);
            Utils.stopPropagation(e);
            if (Utils.getTarget(e).type === 'button') {
                var value = me.textArea.value;
                if (value === '') {
                    return;
                }
                value = parseInt(value);

                var id = e.target.id;
                if (id === 'left-in') {
                    me.leftIn(parseInt(me.textArea.value));
                } else if (id === 'right-in') {
                    me.rightIn(parseInt(me.textArea.value));
                } else if (id === 'left-out') {
                    me.leftOut();
                } else if (id === 'right-out') {
                    me.rightOut();
                } else {
                    throw ('type error');
                }
            }
        }).addHandler(this.textArea, 'keypress', function(e) {
            e = Utils.getEvent(e);
            var charCode = Utils.getCharCode(e);

            if (!/\d/.test(String.fromCharCode(charCode)) && charCode > 9 && !e.ctrlKey) {
                Utils.preventDefault(e);
            }
        }).addHandler(this.textArea, 'paste', function(e) {
            e = Utils.getEvent(e);
            var text = Utils.getClipboardText(e);
            if (!/^\d*$/.test(text)) {
                Utils.preventDefault(e);
            }
        });
        //为每个数字绑定事件

        Utils.addHandler(this.box, 'click', function(e) {
            e = Utils.getEvent(e);
            var target = Utils.getTarget(e);

            if (target.className === 'number') {
                if (typeof Array.prototype.indexOf != 'function') {
                    Array.prototype.indexOf = function(element, fromIndex) {
                        var index = -1;
                        fromIndex = fromIndex * 1 || 0;
                        for (var k = fromIndex, length = this.length; k < length; k++) {
                            if (this[k] === element) {
                                index = k;
                                break;
                            }
                        }
                        return index;
                    }
                }
                var index = Array.prototype.indexOf.apply(target.parentNode.childNodes, [target, 0]);
                me.data.splice(index - 1, 1);
                me.removeItem(index);
            }
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
            var oldItem = document.getElementsByClassName('number')[0];
            var newItem = document.createElement('div');

            newItem.className = 'number';
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

                newItem.className = 'number';
                newItem.innerText = number;

                doc[0].appendChild(newItem);
            }
        },
        removeLast: function() {
            var doc = document.getElementsByClassName('number');
            if (doc.length) {
                this.box.removeChild(doc[doc.length - 1]);
            }
        },
        removeItem: function(idx) {
            var doc = document.getElementsByClassName('number');
            if (doc.length) {
                this.box.removeChild(doc[idx - 1]);
            }
        }
    }
    var queue = new queue();
})();
