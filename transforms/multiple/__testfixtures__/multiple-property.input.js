import { create, property } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  disabled: property('disabled', '.tags', { multiple: true })
});
