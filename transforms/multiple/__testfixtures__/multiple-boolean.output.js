import { create, isVisible, isHidden, isPresent } from 'ember-cli-page-object';

const page = create({
  spansArePresent: isPresent('span'),
  spansAreVisible: isVisible('span'),
  spansAreHidden: isHidden('span')
});
