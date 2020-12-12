import { create, text } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  tags: text('.tag', { multiple: true })
});
