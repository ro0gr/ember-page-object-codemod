import { create, isVisible, isHidden, isPresent } from 'ember-cli-page-object';

const page = create({
  spansArePresent: isPresent('span', { multiple: true }),
  spansAreVisible: isVisible('span', { multiple: true }),
  spansAreHidden: isHidden('span', { multiple: true })
});
