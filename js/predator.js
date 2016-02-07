// function Tiger() {}

// Tiger.prototype.act = function(view) {
//   // This is just a dummy behavior
//   return {
//     type: "move",
//     direction: "e"
//   };
// };

function Tiger() {};

function Tiger() {
  this.energy = 40;
}
Tiger.prototype.act = function(view) {
  var space = view.find(" ");
  if (this.energy > 60 && space)
    return {type: "reproduce", direction: space};
  var SmartPlantEater = view.find("O");
  if (SmartPlantEater)
    return {type: "eat", direction: SmartPlantEater};
  if (space)
    return {type: "move", direction: space};
};


LifelikeWorld.prototype.letAct = function(Tiger, vector) {
  var action = Tiger.act(new View(this, vector));
  var handled = action &&
    action.type in actionTypes &&
    actionTypes[action.type].call(this, Tiger,
                                  vector, action);
  if (!handled) {
    Tiger.energy -= 0.2;
    if (Tiger.energy <= 0)
      this.grid.set(vector, null);
  }
};

actionTypes.eat = function(Tiger, vector, action) {
  var dest = this.checkDestination(action, vector);
  var atDest = dest != null && this.grid.get(dest);
  if (!atDest || atDest.energy == null)
    return false;
  Tiger.energy += atDest.energy;
  this.grid.set(dest, null);
  return true;
};

actionTypes.grow = function(Tiger) {
  Tiger.energy += 1.5;
  return true;
};

actionTypes.reproduce = function(Tiger, vector, action) {
  var baby = elementFromChar(this.legend,
                             Tiger.originChar);
  var dest = this.checkDestination(action, vector);
  if (dest == null ||
      Tiger.energy <= 2 * baby.energy ||
      this.grid.get(dest) != null)
    return false;
  Tiger.energy -= 2 * baby.energy;
  this.grid.set(dest, baby);
  return true;
};