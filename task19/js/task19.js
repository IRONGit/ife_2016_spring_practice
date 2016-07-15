(function() {
    var $ = function(element) {
        return element.indexOf('#') === 0 ? document.querySelector(element) : document.querySelectorAll(element);
    };

    var Sort = (function() {
        function sort() {
            this.seq = [];
            this.done = false;
        }
        sort.prototype = {
            reset: function() {
                this.done = false;
                this.seq.length = 0;
            },
            bubbleSort: function(array, elements) {
                if (array.length !== elements.length || elements.length === 0) {
                    return;
                }
                var me = this;
                if (me.done) {
                    alert('already done');
                    return;
                }
                for (var i = 0; i < array.length; i++) {
                    for (var j = i + 1; j < array.length; j++) {
                        if (array[i] > array[j]) {
                            var t = array[i];
                            array[i] = array[j];
                            array[j] = t;
                            //记录每次排序结果
                            this.seq.push(array.slice());
                        }
                    }
                }
                var count = 0;

                var parent = elements[0].parentNode;

                clearInterval(window.animation);

                window.animation = setInterval(function() {
                    parent.innerHTML = '';

                    for (var i = 0; i < me.seq[count].length; i++) {
                        var num = document.createElement('div');

                        num.className = 'number';
                        num.style.height = me.seq[count][i] + 'px';
                        num.style.left = i * 20 + 'px';

                        parent.appendChild(num);
                    }

                    count++;
                    if (count === me.seq.length) {
                        me.done = true;
                        alert('done');
                        clearInterval(window.animation);
                    }

                }, 10);
            }
        };

        return {
            sort: sort
        };
    })();

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
        };
    })();



    function queue() {
        var me = this;
        this.data = [];
        this.leftInBtn = $('#left-in');
        this.leftOutBtn = $('#left-out');
        this.rightInBtn = $('#right-in');
        this.rightOutBtn = $('#right-out');
        this.textArea = $('#text');
        this.box = $('.box')[0];

        this.wrapper = $('.wrapper')[0];

        this.sort = new Sort.sort();

        Utils.addHandler(this.wrapper, 'click', function(e) {
            e = Utils.getEvent(e);
            Utils.preventDefault(e);
            Utils.stopPropagation(e);
            var target = Utils.getTarget(e);

            if (target.type === 'button' && target.id !== 'generate' && target.id !== 'bubble-sort-btn') {
                var value = me.textArea.value;
                if (value === '') {
                    return;
                }
                value = parseInt(value);

                var id = target.id;
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

            if (target.id === 'generate') {
                me.generateNumbers();
            }
            if (target.id == 'bubble-sort-btn') {
                me.bubbleSort();
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
                    };
                }
                var index = Array.prototype.indexOf.apply(target.parentNode.childNodes, [target, 0]);
                me.data.splice(index, 1);
                me.removeItem(index + 1);
            }
        });
    }

    queue.prototype = {
        bubbleSort: function() {
            this.sort.bubbleSort(this.data, $('.number'));
        },
        leftIn: function(number) {
            if (this.data.length < 60) {
                this.data.unshift(number);
                this.insertFromLeft(number);
            }
        },
        leftOut: function() {
            this.data.shift();
            this.removeFirst();
        },
        rightIn: function(number) {
            if (this.data.length < 60) {
                this.data.push(number);
                this.insertFromRight(number);
            }
        },
        rightOut: function() {
            this.data.pop();
            this.removeLast();
        },
        insertFromLeft: function(number) {
            var oldItem = document.getElementsByClassName('number')[0];
            var newItem = document.createElement('div');

            newItem.className = 'number';
            newItem.style.height = number + 'px';
            newItem.style.left = 0 + 'px';

            var numbers = document.getElementsByClassName('number');

            for (var i = 0; i < numbers.length; i++) {
                var left = parseInt(numbers[i].style.left);
                numbers[i].style.left = left + 20 + 'px';
            }


            this.box.insertBefore(newItem, oldItem);
        },
        removeFirst: function() {
            var doc = document.getElementsByClassName('number');
            if (doc.length) {
                this.box.removeChild(doc[0]);
                for (var i = 0; i < doc.length; i++) {
                    var left = parseInt(doc[i].style.left);
                    doc[i].style.left = left - 20 + 'px';
                }
            }
        },
        insertFromRight: function(number) {
            var doc = document.getElementsByClassName('box');
            if (doc.length) {
                var newItem = document.createElement('div');

                newItem.className = 'number';
                newItem.style.left = $('.number').length * 20 + 'px';
                newItem.style.height = number + 'px';

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
        },
        generateNumbers: function() {
            this.data.length = 0;
            for (var i = 0; i < 50; i++) {
                this.data.push(Math.floor(Math.random() * 90 + 10));
            }
            this.renderRandomNumbers();
            //每次生成新数组要重置sort的属性
            this.sort.reset();
        },
        renderRandomNumbers: function() {
            this.box.innerHTML = "";
            for (var i = 0, length = this.data.length; i < length; i++) {
                var number = document.createElement('div');
                number.className = 'number';
                number.style.left = i * 20 + "px";
                number.style.height = this.data[i] + 'px';
                this.box.appendChild(number);
            }
        }
    };
    var tQueue = new queue();
})();
