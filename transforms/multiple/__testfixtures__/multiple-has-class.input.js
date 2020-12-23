import { create, hasClass } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  messagesAreSuccessful: hasClass('success', 'span', { multiple: true })
});
