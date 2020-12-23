import { create, notHasClass, collection } from 'ember-cli-page-object';

const page = create({
  scope: 'div',

  _messagesAreUnsuccessful: collection('span', {
    messagesAreUnsuccessful: notHasClass('success')
  }),

  messagesAreUnsuccessful: {
    isDescriptor: true,

    get: function() {
      return this._messagesAreUnsuccessful.map((el) => el.messagesAreUnsuccessful);
    }
  }
});
