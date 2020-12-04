import { create, attribute, collection } from 'ember-cli-page-object';

const page = create({
  scope: 'div',

  _checked: collection('.tags', {
    checked: attribute('checked')
  }),

  checked: {
    isDescriptor: true,

    get: function() {
      return this._checked.map((el) => el.checked);
    }
  }
});
