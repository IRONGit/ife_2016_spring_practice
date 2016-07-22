(function() {
    function Commander() {
        this.ships = {};
        this.shipfactory = new ShipFactory();
        this.mediator = new mediator();
    }
    Commander.prototype = {
        sendOrder: function(order) {
            this.mediator.send(order,this);
        },
        createShip: function(id) {
            var ship = this.shipfactory.createShip({
                id: id
            });
            this.ships["ship" + id] = ship;

            this.mediator.register(ship);

            setTimeout(function() {
                ship.show();
            }, 1000);
        }
    };
    window.Commander = Commander;
})();
