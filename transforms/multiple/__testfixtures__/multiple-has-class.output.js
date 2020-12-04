import { create, hasClass, collection } from 'ember-cli-page-object';

const page = create({
  scope: 'div',

  _messagesAreSuccessful: collection('span', {
    messagesAreSuccessful: hasClass('success')
  }),

  messagesAreSuccessful: {
    isDescriptor: true,

    get: function() {
      return this._messagesAreSuccessful.map((el) => el.messagesAreSuccessful);
    }
  }
});
