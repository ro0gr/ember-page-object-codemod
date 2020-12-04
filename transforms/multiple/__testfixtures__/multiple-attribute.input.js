import { create, attribute } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  checked: attribute('checked', '.tags', { multiple: true })
});
