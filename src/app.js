import riot from 'riot';
riot.util.tmpl.errorHandler = function(err) { console.log(err) };

import dispatcher from './dispatcher';
import actions from './actions';
import DataStore from './data-store';
import './tags';

riot.route('/', function() {
  mount('cmdb');
});

let currentTag = null;
let mount = function(tagName) {
  if (currentTag) {
    currentTag.unmount(true);
  }
  currentTag = riot.mount('app', tagName,  {store: dataStore})[0];
  dispatcher.trigger(actions.ROUTE_CHANGED);
};

let dataStore = new DataStore();
dispatcher.addStore(dataStore);

riot.route.start(true);
