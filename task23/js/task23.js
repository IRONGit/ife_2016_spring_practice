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

    var Queue = function() {
        this._oldestIndex = 1;
        this._newestIndex = 1;
        this._storage = {};
    };
    Queue.prototype.size = function() {
        return this._newestIndex - this._oldestIndex;
    };

    Queue.prototype.enqueue = function(data) {
        this._storage[this._newestIndex] = data;
        this._newestIndex++;
    };

    Queue.prototype.dequeue = function() {
        var oldestIndex = this._oldestIndex,
            newestIndex = this._newestIndex,
            deletedData;

        if (oldestIndex !== newestIndex) {
            deletedData = this._storage[oldestIndex];
            delete this._storage[oldestIndex];
            this._oldestIndex++;

            return deletedData;
        }
    };

    function Node(data) {
        this.data = data;
        this.parent = null;
        this.isTarget = false;
        this.children = getChildNodes(data) || [];
    }

    function Tree(data) {
        this._root = new Node(data);
    }

    Tree.prototype = {
        traverseDF: function(callback) {
            (function recurse(currentNode) {
                for (var i = 0; i < currentNode.children.length; i++) {
                    recurse(currentNode.children[i]);
                }
                callback(currentNode);
            })(this._root);
        },
        traverseBF: function(callback) {
            var queue = new Queue();
            queue.enqueue(this._root);
            var currentTree = queue.dequeue();
            while (currentTree) {
                for (var i = 0; i < currentTree.children.length; i++) {
                    queue.enqueue(currentTree.children[i]);
                }
                callback(currentTree);
                currentTree = queue.dequeue();
            }
        },
        traverseLevel: function(callback) {
            (function recurse(currentNode) {
                callback(currentNode);
                for (var i = 0; i < currentNode.children.length; i++) {
                    recurse(currentNode.children[i]);
                }
            })(this._root);
        },
        contains: function(callback, traverse) {
            traverse.call(this, callback);
        },
        add: function(data, toData, traversal) {
            var child = new Node(data),
                parent = null,
                callback = function(node) {
                    if (node.data === toData) {
                        parent = node;
                    }
                };
            this.contains(callback, traversal);

            if (parent !== null) {
                parent.children.push(child);
                child.parent = parent;
            } else {
                throw new Error('Cannot add node to a non-existent parent.');
            }
        }
    };

    var index = 0;
    var list = [];
    var root = $('#super');
    var tree = new Tree($('.container-wrapper')[0]);

    //重置属性
    function reset() {
        clearInterval(window.animation);
        setNodeColor();
        for (var i = 0; i < list.length; i++) {
            list[i].isTarget = false;
        }
        list.length = 0;
        index = 0;
    }

    window.onload = function() {
        var ops = $('#ops').childNodes;

        Utils.addHandler($('#start-btn'), 'click', function(e) {
            reset();
            var option;

            //判断选择的遍历方式
            Array.prototype.forEach.call(ops, function(item, index, ops) {
                if (item.selected === true) {
                    option = index;
                }
            });

            var value = ops[option].value;
            if (value === "dfs") {
                Tree.prototype.traverseDF.apply(tree, [function(node) {
                    list.push(node);
                }]);
                paint(0, list.length - 2);
            } else if (value === "bfs") {
                Tree.prototype.traverseBF.apply(tree, [function(node) {
                    list.push(node);
                }]);
                paint(1, list.length - 1);
            } else if (value === "level") {
                Tree.prototype.traverseLevel.apply(tree, [function(node) {
                    list.push(node);
                }]);
                paint(1, list.length - 1);
            } else {
                throw new Error("type error");
            }
        });

        Utils.addHandler($('#search'), 'click', function(e) {
            reset();
            var value = $('#search-text').value;
            var option;

            //判断选择的遍历方式
            Array.prototype.forEach.call(ops, function(item, index, ops) {
                if (item.selected === true) {
                    option = index;
                }
            });

            var choice = ops[option].value;

            if (choice === "dfs") {
                Tree.prototype.traverseDF.apply(tree, [function(node) {
                    callbacl4Search(node)(value);
                }]);
                paint(0, list.length - 1);
            } else if (choice === "bfs") {
                Tree.prototype.traverseBF.apply(tree, [function(node) {
                    callbacl4Search(node)(value);
                }]);
                paint(0, list.length - 1);
            } else if (choice === "level") {
                Tree.prototype.traverseLevel.apply(tree, [function(node) {
                    callbacl4Search(node)(value);
                }]);
                paint(0, list.length - 1);
            } else {
                throw new Error('Error Type');
            }
        });
    };

    function callbacl4Search(node) {
        return function(value) {
            if (node.innerText) {
                if (node.innerText.split(/[\s]/)[0] === value) {
                    node.isTarget = true;
                }
                list.push(node);
            }
        };
    }

    function getChildNodes(node) {
        var children = [];
        for (var i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i].nodeName !== "#text") {
                children.push(node.childNodes[i]);
            }
        }
        return children;
    }

    function setNodeColor(first, last) {
        var i = first || 0;
        var end = last || list.length - 2;
        for (; i < end; i++) {
            if (list[i].style) {
                list[i].style.backgroundColor = "#fff";
            }
        }
    }


    function paint(first, last) {
        //开始之前需要设置所有节点的颜色
        setNodeColor(first, last);
        list[first].style.backgroundColor = "#669900";
        clearInterval(window.animation);
        index = first;
        window.animation = setInterval(function() {
            index++;
            if (!list[index - 1].isTarget) {
                list[index - 1].style.backgroundColor = "#fff";
            } else {
                list[index - 1].style.backgroundColor = "red";
            }
            if (!list[index].isTarget) {
                list[index].style.backgroundColor = "#669900";
            } else {
                list[index].style.backgroundColor = "red";
            }

            if (index === last) {
                clearInterval(window.animation);
                if (!list[index].isTarget) {
                    setTimeout(function() {
                        list[index].style.backgroundColor = "#fff";
                    }, 300);
                }
            }
        }, 300);
    }
})();
