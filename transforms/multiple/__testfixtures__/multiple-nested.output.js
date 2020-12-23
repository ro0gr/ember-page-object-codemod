import { attribute, collection } from 'ember-cli-page-object';

const NestedPage = {
  _test: collection('.tags', {
    test: attribute('src')
  }),

  test: {
    isDescriptor: true,

    get: function() {
      return this._test.map((el) => el.test);
    }
  }
};

export default {
  nested: {
    _test: collection('.tags', {
      test: attribute('src')
    }),

    test: {
      isDescriptor: true,

      get: function() {
        return this._test.map((el) => el.test);
      }
    }
  },
  nested2: NestedPage
};
