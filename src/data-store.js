'use strict';

import Riot from 'riot';

import actions from './actions';
import getUrl from './convert';

export default function DataStore() {
  Riot.observable(this);
  this.CHANGED_EVENT = 'CHANGED_EVENT';

  this.initStore = () => {
    let config = `

DMP	calls	Origin Services	Frontend
DSP	calls	Nginx	Frontend
Origin Services	includes	Company Service	Front backend
Origin Services	includes	Users Service	Front backend
Fuel Services	includes	RBAC Service	Front backend
Analytics Services	exposes	Currency Service	Front backend
Analytics Services	includes	Metrics Service	Front backend
Nginx	exposes	Fuel Services	Front backend
Nginx	exposes	Analytics Services	Front backend
Nginx	serves	DSP	Front backend
Baogao	includes	Currency Service	Backend services
Currency Service			Backend services
RBAC Service			Backend services
Company Service	calls	RBAC Service	Backend services
Users Service	calls	RBAC Service	Backend services
Metrics Service	calls	RBAC Service	Backend services
Metrics Service	has database	Reports Vertica	Backend services
Metrics Service	has database	Reports MySQL	Backend services
Company Service	has database	Master Oracle	Backend services
Company Service	has database	Master MySQL	Backend services
Currency Service	has database	Reports Vertica	Backend services
Currency Service	has database	Reports MySQL	Backend services
Auth	includes	Okta Auth	Frontend
Auth	includes	Google Auth	Frontend
DMP	redirects to	Okta Auth	Frontend
DSP	redirects to	Okta Auth	Frontend
DSP	redirects to	Google Auth	Frontend
Master database	includes	Master MySQL	Databases
Master database	includes	Master Oracle	Databases
Reports database	includes	Reports Vertica	Databases
Reports database	includes	Reports MySQL	Databases
`;
    this.updateData(config);
  };

  this.getPlantUrl = (data) => {
    return getUrl(data);
  };

  this.updateData = (config) => {
    this.config = config;
    this.data = this.configToUml(config);
    this.dataView = getUrl(this.data);
    this.triggerChanged();
  };

  this.configToUml = (config) => {
    config = config.split("\n")
      .filter(function(el) { return !!el;})
      .map(function(el) { return el.split('\t')});
    function getId(str) {
      return str.split(" ").join("_").split("-").join("_").split("(").join("_").split(")").join("_").split(".").join("_").split("/").join("_").split(":").join("_");
    }
    var result = "";
    var types = new Set();
    config.forEach(function(el) {types.add(el[3]);});
    for (let type of types) {
      result += 'frame "' + type + '" {\n';
      let agents = new Set();
      config.filter(function(el) { return el[3] === type;}).forEach(function(el) {agents.add(el[0]);});
      for(let agent of agents) {
        var inclusions = new Set();
        config.filter(function(el) { return el[3] === type && el[0] === agent && el[1] === "includes"; }).forEach(function(el) {inclusions.add(el[2]);});
        for(let inclusion of inclusions) {
          result += 'node "' + agent + '" as ' + getId(agent) + ' {\n';
            result += 'agent "' + inclusion + '" as ' + getId(inclusion) + '\n';
          result += '}\n';
        }
        if (!inclusions.size) {
          result += 'agent "' + agent + '" as ' + getId(agent) + '\n';
        }
      }
      result += '}\n';
    }
    return config.reduce(function(prev, cur) {
      var res = prev;
      var arrow = " --> ";
      if(cur[1] === "exposes") {
        arrow = " -down-> ";
      }
      if(cur[1] && cur[1] != "includes") {
        res += getId(cur[0]) + arrow + getId(cur[2]) + "\n";
      }
      return res;
    }, result);
  }

  this.triggerChanged = () => {
    this.trigger(this.CHANGED_EVENT);
  };
  
  this.on(this.CHANGED_EVENT, () => {
  });

  this.on(actions.ROUTE_CHANGED, () => {
    this.initStore();
  });
  
  this.on(actions.UPDATE_DATA, (data) => {
    this.updateData(data.data);
  });
};
