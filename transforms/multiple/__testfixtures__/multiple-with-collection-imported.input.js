import { create, text, collection } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  names: collection('.name'),
  tags: text('.tag', { multiple: true })
});
