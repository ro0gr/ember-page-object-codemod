import { attribute } from 'attribute';

export default {
  nested: {
    test: attribute('src', '.tags', { multiple: true })
  }
};
