import { create, clickable } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  clickTag: clickable('.tag', { multiple: true })
});
