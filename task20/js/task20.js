(function() {
    var $ = function(element) {
        return element.indexOf('#') === 0 ? document.querySelector(element) : document.querySelectorAll(element);
    };

    $.prototype.each = function(element, obj, type) {
        var i = 0,
            key;
        if (type === 'attr') {
            for (i = 0; i < element.length; i++) {
                for (key in obj) {
                    element[i].style[key] = obj[key];
                }
            }
        } else {
            for (i = 0; i < element.length; i++) {
                for (key in obj) {
                    element[i][key] = obj[key];
                }
            }
        }
    };

    /*利用惰性载入,提高性能*/
    var Utils = (function() {
        return {
            addHandler: function(element, event, handler) {
                if (element.addEventListener) {
                    addHandler = function(element, event, handler) {
                        element.addEventListener(event, handler, false);
                    };
                } else if (element.attachEvent) {
                    addHandler = function(element, event, handler) {
                        element.attachEvent('on' + event, handler);
                    };
                } else {
                    addHandler = function(element, event, handler) {
                        element['on' + event] = handler;
                    };
                }
                return addHandler(element, event, handler);
            },
            removeHandler: function(element, event, handler) {
                if (element.removeEventListener) {
                    removeHandler = function(element, event, handler) {
                        element.removeEventListener(event, handler, false);
                    };
                } else if (element.detachEvent) {
                    removeHandler = function(element, event, handler) {
                        element.detachEvent('on' + event, handler);
                    };
                } else {
                    removeHandler = function(element, event, handler) {
                        element['on' + event] = null;
                    };
                }
                return removeHandler(element, event, handler);
            },
            getEvent: function(event) {
                return event ? event : window.event;
            },
            preventDefault: function(event) {
                if (event.preventDefault) {
                    preventDefault = function(event) {
                        event.preventDefault();
                    };
                } else {
                    preventDefault = function(event) {
                        event.returnValue = false;
                    };
                }
                return preventDefault(event);
            },
            stopPropagation: function(event) {
                if (event.stopPropagation) {
                    stopPropagation = function(event) {
                        event.stopPropagation();
                    };
                } else {
                    stopPropagation = function(event) {
                        event.cancelBubble = true;
                    };
                }
                return stopPropagation(event);
            },
            getCharCode: function(e) {
                if (typeof e.charCode == 'number') {
                    getCharCode = function(e) {
                        return e.charCode;
                    };
                } else {
                    getCharCode = function(e) {
                        return e.keyCode;
                    };
                }
                return getCharCode(e);
            },
            getClipboardText: function(e) {
                var clipboardData = e.clipboardData || window.clipboardData;
                return clipboardData.getData('text');
            },
            getTarget: function(event) {
                return event.target || event.srcElement;
            }
        };
    })();



    function queue() {
        var me = this;
        this.data = [];
        this.leftInBtn = $('#left-in');
        this.leftOutBtn = $('#left-out');
        this.rightInBtn = $('#right-in');
        this.rightOutBtn = $('#right-out');
        this.textArea = $('#textArea');
        this.box = $('.box')[0];
        this.wrapper = $('.wrapper')[0];
        this.searchBtn = $('#search');
        this.searchText = $('#text-search');

        this.pattern = /[\,,\，,\;,\；,\、,\s]+/;

        Utils.addHandler(this.wrapper, 'click', function(e) {
            e = Utils.getEvent(e);
            Utils.preventDefault(e);
            Utils.stopPropagation(e);
            var target = Utils.getTarget(e);

            if (target.type === 'button' && target.id !== 'search') {
                var value = me.textArea.value;
                if (value === '') {
                    return;
                }
                var id = target.id;
                if (id === 'left-in') {
                    me.leftIn(value);
                } else if (id === 'right-in') {
                    me.rightIn(value);
                } else if (id === 'left-out') {
                    me.leftOut();
                } else if (id === 'right-out') {
                    me.rightOut();
                } else {
                    throw ('type error');
                }
            }

            if (target.id === 'search') {
                me.searchRelevant();
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
                    };
                }
                var index = Array.prototype.indexOf.apply(target.parentNode.childNodes, [target, 0]);
                me.data.splice(index, 1);
                me.removeItem(index + 1);
            }
        });
    }

    queue.prototype = {
        searchRelevant: function() {
            var number = $('.number');
            $.prototype.each(number, {
                color: "#000"
            }, 'attr');
            var data = this.data;
            var text = this.searchText.value;
            for (var i = 0, length = data.length; i < length; i++) {
                if (data[i].indexOf(text) != -1) {
                    number[i].style.color = "blue";
                }
            }
        },
        leftIn: function(text) {
            if (this.data.length < 60) {
                //对输入内容进行处理
                text = text.split(this.pattern);
                for (var i = text.length - 1; i >= 0; i--) {
                    this.insertFromLeft(text[i]);
                }
                this.data = text.concat(this.data);
            }
        },
        leftOut: function() {
            this.data.shift();
            this.removeFirst();
        },
        rightIn: function(text) {
            if (this.data.length < 60) {
                text = text.split(this.pattern);
                for (var i = 0; i < text.length; i++) {
                    this.insertFromRight(text[i]);
                }
                this.data = this.data.concat(text);
            }
        },
        rightOut: function() {
            this.data.pop();
            this.removeLast();
        },
        insertFromLeft: function(text) {
            var oldItem = $('.number')[0];
            var newItem = document.createElement('div');

            newItem.className = 'number';
            newItem.innerText = text;
            newItem.style.left = 0 + 'px';

            var numbers = $('.number');


            for (var i = 0, length = numbers.length; i < length; i++) {
                var left = parseInt(numbers[i].style.left);
                numbers[i].style.left = left + 20 + 'px';
            }
            this.box.insertBefore(newItem, oldItem);
        },
        removeFirst: function() {
            var doc = $('.number');
            if (doc.length) {
                this.box.removeChild(doc[0]);
                for (var i = 0; i < doc.length; i++) {
                    var left = parseInt(doc[i].style.left);
                    doc[i].style.left = left - 20 + 'px';
                }
            }
        },
        insertFromRight: function(text) {
            var doc = $('.box');

            if (doc.length) {
                var newItem = document.createElement('div');
                newItem.className = 'number';
                newItem.style.left = $('.number').length * 20 + 'px';
                newItem.innerText = text;

                doc[0].appendChild(newItem);
            }
        },
        removeLast: function() {
            var doc = $('.number');
            if (doc.length) {
                this.box.removeChild(doc[doc.length - 1]);
            }
        },
        removeItem: function(idx) {
            var doc = $('.number');
            if (doc.length) {
                this.box.removeChild(doc[idx - 1]);
            }
        }
    };
    var tQueue = new queue();
})();
