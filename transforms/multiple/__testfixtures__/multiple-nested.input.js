import { attribute } from 'ember-cli-page-object';

const NestedPage = {
  test: attribute('src', '.tags', { multiple: true })
};

export default {
  nested: {
    test: attribute('src', '.tags', { multiple: true })
  },
  nested2: NestedPage
};
