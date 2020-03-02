let events = {};

function on(name, self, callback) {
  console.log("on(name, self, callback)")
  console.log(name)
  console.log(self)
  console.log(callback)
  let tuple = [self, callback];
  let callbacks = events[name];
  if (Array.isArray(callbacks)) {
    callbacks.push(tuple);
  }
  else {
    events[name] = [tuple];
  }
}

function remove(name, self) {
  console.log("remove(name, self)")
  console.log(name)
  console.log(self)
  let callbacks = events[name];
  if (Array.isArray(callbacks)) {
    events[name] = callbacks.filter((tuple) => {
      return tuple[0] != self;
    })
  }
}

function emit(name, data) {
  console.log("emit(name, data)")
  console.log(name)
  console.log(data)
  let callbacks = events[name];
  console.log(callbacks)
  if (Array.isArray(callbacks)) {
    callbacks.map((tuple) => {
      let self = tuple[0];
      let callback = tuple[1];
      callback.call(self, data);
    })
  }
}

exports.on = on;
exports.remove = remove;
exports.emit = emit;