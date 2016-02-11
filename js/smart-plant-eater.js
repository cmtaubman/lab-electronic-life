// function SmartPlantEater() {};

function SmartPlantEater() {
  this.energy = 40;
}
SmartPlantEater.prototype.act = function(view) {
  var space = view.find(" ");
  if (this.energy > 40 && space)
    return {type: "reproduce", direction: space};
  var plant = view.find("*");
  if (plant)
    return {type: "eat", direction: plant};
  if (space)
    return {type: "move", direction: space};
};



LifelikeWorld.prototype.letAct = function(SmartPlantEater, vector) {
  var action = SmartPlantEater.act(new View(this, vector));
  var handled = action &&
    action.type in actionTypes &&
    actionTypes[action.type].call(this, SmartPlantEater,
                                  vector, action);
  if (!handled) {
    SmartPlantEater.energy -= 0.2;
    if (SmartPlantEater.energy <= 0)
      this.grid.set(vector, null);
  }
};

actionTypes.eat = function(SmartPlantEater, vector, action) {
  var dest = this.checkDestination(action, vector);
  var atDest = dest != null && this.grid.get(dest);
  if (!atDest || atDest.energy == null)
    return false;
  SmartPlantEater.energy += atDest.energy;
  this.grid.set(dest, null);
  return true;
};

actionTypes.grow = function(SmartPlantEater) {
  SmartPlantEater.energy += 1.5;
  return true;
};

actionTypes.reproduce = function(SmartPlantEater, vector, action) {
  var baby = elementFromChar(this.legend,
                             SmartPlantEater.originChar);
  var dest = this.checkDestination(action, vector);
  if (dest == null ||
      SmartPlantEater.energy <= 2 * baby.energy ||
      this.grid.get(dest) != null)
    return false;
  SmartPlantEater.energy -= 2 * baby.energy;
  this.grid.set(dest, baby);
  return true;
};

