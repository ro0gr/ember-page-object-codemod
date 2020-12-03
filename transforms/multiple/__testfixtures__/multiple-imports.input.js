import { create, isPresent } from 'ember-cli-page-object';
import { text } from 'ember-cli-page-object';

const page = create({
  scope: 'div',
  tags: text('.tags', { multiple: true }),
  titlePresent: isPresent('.title')
});
