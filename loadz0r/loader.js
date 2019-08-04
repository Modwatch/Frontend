var mod = "module";
var singleRequire = function(name) {
  if (name !== "require" && name.indexOf(".js") === -1) {
    name = name + ".js";
  }
  if (!registry[name]) {
    return new Promise(function(resolve) {
      if ("document" in self) {
        var script = document.createElement("script");
        script.src = process.env.PUBLIC_PATH + name.slice(1);
        document.head.appendChild(script);
        script.onload = resolve;
      } else {
        importScripts(name);
        resolve();
      }
    }).then(function() {
      if (!registry[name]) {
        throw new Error(mod + " " + name + " not reg'd");
      }
      return registry[name];
    });
  } else {
    return Promise.resolve(registry[name]);
  }
};

var require = function(names, resolve) {
  Promise.all(names.map(singleRequire)).then(function(modules) {
    resolve(modules.length === 1 ? modules[0] : modules);
  });
};

// FIXME: This is probably not generic, lol.
require.toUrl = function(id) {
  return "./" + id;
};

var registry = {
  require: Promise.resolve(require)
};

self.define = function(moduleName, depsNames, factory) {
  if (registry[moduleName]) {
    // Module is already loading or loaded.
    return;
  }
  registry[moduleName] = new Promise(function(resolve) {
    var exports = {};
    var module = {
      uri: location.origin + process.env.PUBLIC_PATH + moduleName.slice(1)
    };
    Promise.all(
      depsNames.map(function(depName) {
        if (depName === "exports") {
          return exports;
        }
        if (depName === mod) {
          return module;
        }
        return singleRequire(depName);
      })
    ).then(function(deps) {
      var facValue = factory.apply(null, deps);
      if (!exports.default) {
        exports.default = facValue;
      }
      resolve(exports);
    });
  });
};
