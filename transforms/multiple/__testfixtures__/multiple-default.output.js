import { property, collection } from 'ember-cli-page-object';

export default {
  scope: 'div',

  _disabled: collection('.tags', {
    disabled: property('disabled')
  }),

  disabled: {
    isDescriptor: true,

    get: function() {
      return this._disabled.map((el) => el.disabled);
    }
  }
};
