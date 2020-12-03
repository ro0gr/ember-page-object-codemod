import { create, text } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  name: text('.name'),
  tags: text('.tag', { multiple: true })
});
