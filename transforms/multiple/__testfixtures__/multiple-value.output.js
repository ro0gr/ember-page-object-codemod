import { create, collection } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  _values: collection('input'),

  values: {
    isDescriptor: true,

    get: function() {
      return this._values.map((el) => el.value);
    }
  }
});
