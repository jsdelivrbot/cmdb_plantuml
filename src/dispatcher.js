'use strict';

export default {

  _stores: [],

  addStore(store) {
    this._stores.push(store);
  },

  trigger: function() {
    let args = [].slice.call(arguments);
    console.log('dispatcher: trigger: ' + args);
    this._stores.forEach(function(el) {
      el.trigger.apply(null, args);
    });
  },

  on(ev, cb) {
    this._stores.forEach(function(el) {
      el.on(ev, cb);
    });
  },

  off(ev, cb) {
    this._stores.forEach(function(el) {
      if (cb)
        el.off(ev, cb);
      else
        el.off(ev);
    });
  },

  one(ev, cb) {
    this._stores.forEach(function(el) {
      el.one(ev, cb);
    });
  }

};
