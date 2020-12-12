import { property } from 'ember-cli-page-object';

export default {
  scope: 'div',
  disabled: property('disabled', '.tags', { multiple: true })
};
