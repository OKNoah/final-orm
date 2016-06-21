// Generated by CoffeeScript 1.10.0
var ComponentPatcher, HotLoader;

ComponentPatcher = require('./component-patcher');

module.exports = new (HotLoader = (function() {
  function HotLoader() {}

  HotLoader.prototype.patch = function(module) {
    var defaultMode, target;
    if (!module.hot) {
      return;
    }
    defaultMode = 'default' in module.exports;
    target = module.exports;
    if (ComponentPatcher.test(target)) {
      target = ComponentPatcher.patch(target, module);
    }
    module.exports = target;
  };

  return HotLoader;

})());

//# sourceMappingURL=hot-loader.js.map