import { create, collection } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  names: collection('.name'),
  _tags: collection('.tag'),

  tags: {
    isDescriptor: true,

    get: function() {
      return this._tags.map((el) => el.text);
    }
  }
});
