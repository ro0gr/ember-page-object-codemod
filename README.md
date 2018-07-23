# ember-page-object-codemod


A collection of codemod's for [ember-cli-page-object](https://github.com/san650/ember-cli-page-object).

## Usage

To run a specific codemod from this project, you would run the following:

```
npx ember-page-object-codemod <TRANSFORM NAME> path/of/files/ or/some**/*glob.js

# or

yarn global add ember-page-object-codemod
ember-page-object-codemod <TRANSFORM NAME> path/of/files/ or/some**/*glob.js
```

## Transforms

<!--TRANSFORMS_START-->
* [explicit-async](transforms/explicit-async/README.md)
<!--TRANSFORMS_END-->

## Contributing

### Installation

* clone the repo
* change into the repo directory
* `yarn`

### Running tests

* `yarn test`

### Update Documentation

* `yarn update-docs`