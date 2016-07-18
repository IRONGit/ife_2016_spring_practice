(function() {
    var $ = function(element) {
        return element.indexOf('#') === 0 ? document.querySelector(element) : document.querySelectorAll(element);
    };
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
            }
        };
    })();

    var index = 0;
    var list = [];
    var root = $('#super');

    //重置属性
    function reset() {
        clearInterval(window.animation);
        setNodeColor();
        list.length = 0;
        index = 0;
    }

    window.onload = function() {
        var ops = $('#ops').childNodes;

        Utils.addHandler($('#start-btn'), 'click', function() {
            reset();
            var option;

            //判断选择的遍历方式
            Array.prototype.forEach.call(ops, function(item, index, ops) {
                if (item.selected === true) {
                    option = index;
                }
            });
            var value = ops[option].value;

            if (value === "first") {
                preOrder(root);
                paint();
            } else if (value === "mid") {
                inOrder(root);
                paint();
            } else if (value === "after") {
                postOrder(root);
                paint();
            } else {
                throw ("type error");
            }
        });
    };

    function getChildNodes(node) {
        var children = [];
        for (var i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i].nodeName !== "#text") {
                children.push(node.childNodes[i]);
            }
        }
        return children;
    }

    function setNodeColor() {
        for (var i = 0; i < list.length; i++) {
            list[i].style.backgroundColor = "#fff";
        }
    }


    function paint() {
        //开始之前需要设置所有节点的颜色
        setNodeColor();

        list[0].style.backgroundColor = "#669900";
        clearInterval(window.animation);
        window.animation = setInterval(function() {
            index++;
            list[index - 1].style.backgroundColor = "#fff";
            list[index].style.backgroundColor = "#669900";
            if (index === list.length - 1) {
                clearInterval(window.animation);
                setTimeout(function() {
                    list[index].style.backgroundColor = "#fff";
                }, 1000);
            }
        }, 1000);
    }
    //先序遍历
    function preOrder(node) {
        if (!node) {
            return;
        }
        list.push(node);
        preOrder(node.firstElementChild);
        preOrder(node.lastElementChild);
    }

    function inOrder(node) {
        if (!node) {
            return;
        }
        inOrder(node.firstElementChild);
        list.push(node);
        inOrder(node.lastElementChild);
    }

    function postOrder(node) {
        if (!node) {
            return;
        }
        postOrder(node.firstElementChild);
        postOrder(node.lastElementChild);
        list.push(node);
    }
})();
