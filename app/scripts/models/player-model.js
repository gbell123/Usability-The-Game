define([
      'jquery',
      'chance',
      'spaceshipModel',
      'solrSystemModel'
    ], function($, Chance, SpaceshipModel, solrSystemModel) {
  var PlayerModel = function() {
    this.chance = new Chance();
    this.fuelFactor = 100000;
    this.activeMissions = [];

    this.init = function() {
      console.log('building playerModel!!');
      this.spaceship = new SpaceshipModel();
      this.health = 90;
      this.resources = {'stardust':50000};
      this.strength = 10;
      
      this.attack = function(attackee) {
        if (Math.random() > .2) { // 80% chance to hit always?
          attackee.health -= this.strength;
          console.log(attackee + 'hit for ' + this.strength)
        } else {
          console.log('missed!');
        }
      }
    };

    this.moveTo = function(solrSystemModel) {
      this.currentLocation = solrSystemModel;
      this.position  = this.currentLocation.position;

      // TODO: We should show the list of available missions here and let the user select the ones he wants. But for now we will just accept the first one
      var missions = this.currentLocation.planets[0].missions;
      if (missions.length > 0) {
        missions[0].activate();
        this.activeMissions.push(missions[0]);
      }
    };

    this.refuelSpaceship = function() {
      // TODO: i changed currentLocation to be a star system, so this check will need to be updated. Sorry!
      if ('fuel' in this.currentLocation.opportunities) {
        var refillCost = this.currentLocation.strength * .25;
        var refill = confirm('Fuel up here? It will cost ' + refillCost + ' grams of stardust.');
        if (refill) {
          this.spaceship.refuel();
          this.stardust -= refillCost;
        }
      }
    }

    this.calculateFuelUsage = function(solrSystem) {
      return lineDistance(this.position, solrSystem.position) * this.fuelFactor;
    };

    function lineDistance( point1, point2 ) {
      var xs = 0;
      var ys = 0;

      xs = point2.x - point1.x;
      xs = xs * xs;

      ys = point2.y - point1.y;
      ys = ys * ys;

      return Math.sqrt( xs + ys );
    }
    // Type of store and amount of stuff we want to buy
    // Assuming the location of the store is the same as our location
    // Also assuming we HAVE a store of this type or wouldn't be trying to buy from it
    this.buyStuff = function(type,quantity){
      store = this.currentLocation.stores[type];
      this.currentLocation.strength += store.sellGoods(quantity);
    }
  };

  return PlayerModel;
});
