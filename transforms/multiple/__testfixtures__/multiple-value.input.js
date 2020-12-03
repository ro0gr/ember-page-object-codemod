import { create, value } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  values: value('input', { multiple: true })
});
