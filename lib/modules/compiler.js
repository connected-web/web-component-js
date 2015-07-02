var instance = {};

instance.compile = function(sourceFilter, destination) {
  sourceFilter = sourceFilter || "*.js";
  destination = destination || "dist";

  console.log("Work in progress: " + sourceFilter + ", " + destination);
}

module.exports = instance;
