import { create, isPresent, collection } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  _tags: collection('.tags'),
  titlePresent: isPresent('.title'),

  tags: {
    isDescriptor: true,

    get: function() {
      return this._tags.map((el) => el.text);
    }
  }
});
