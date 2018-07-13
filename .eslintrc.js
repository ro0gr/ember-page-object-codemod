module.exports = {
    "env": {
        "es6": true,
        "node": true,
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2015
    },

    overrides: [{
        files: [
            'transforms/explicit-async/__testfixtures__/*.js',
        ],
        parserOptions: {
            ecmaVersion: 2017,
            sourceType: 'module'
        },
        env: {
            browser: true,
            node: false
        },
        rules: { 
            'no-undef': 'off'
        }
    }]
};