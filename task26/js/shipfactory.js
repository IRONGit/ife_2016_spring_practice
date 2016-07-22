/*工厂模式*/
(function() {
    var shipFactory = function() {};
    shipFactory.prototype = {
        createShip: function(settings) {
            var ship;
            var id = settings.id;
            switch (id) {
                case 1:
                    ship = new Ship({
                        id: 1
                    });
                    break;
                case 2:
                    ship = new Ship({
                        id: 2
                    });
                    break;
                case 3:
                    ship = new Ship({
                        id: 3
                    });
                    break;
                default:
                    throw new Error("id error");
            }
            return ship;
        }
    };
    window.ShipFactory = shipFactory;
})();
