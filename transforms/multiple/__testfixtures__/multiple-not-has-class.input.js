import { create, notHasClass } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  messagesAreUnsuccessful: notHasClass('success', 'span', { multiple: true })
});
