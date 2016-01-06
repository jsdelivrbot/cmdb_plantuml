'use strict';

import riot from 'riot';

import actions from './actions';
import dispatcher from './dispatcher';

riot.tag('cmdb',
  `<div><user-input store={opts.store}></user-input>
   </div><div><image-output url="{opts.store.dataView}"></image-output></div>`,

  function(opts) {
    opts.store.on(opts.store.CHANGED_EVENT, () => this.update());
  }
);

riot.tag('user-input',
  `<textarea cols=80 rows=10 onchange={updateData} value={opts.store.config}></textarea>
  <!--textarea cols=50 rows=10 onchange={updateData} value={opts.store.data}></textarea-->
  `,

  function(opts) {
    this.updateData = function(e) {
      dispatcher.trigger(actions.UPDATE_DATA, {"data": e.target.value});
    }
  }
);

riot.tag('image-output',
  `<img riot-src={opts.url} />`,

  function(opts) {
  }
);

