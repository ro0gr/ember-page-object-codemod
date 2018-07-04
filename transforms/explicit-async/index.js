const { getParser } = require('codemod-cli').jscodeshift;
// const { getParser } = require('jscodeshift');

const DEFAULT_ACTION_NAMES = [
  'click',
  'visit',
  'focus',
  'blur',
  'fillIn',
  'clickOn'
];

module.exports = function transformer(file, api) {
  const j = getParser(api);

  return j(file.source)
    .find(j.CallExpression)
    .forEach(path => {
      if (
        path.node.callee.type === 'MemberExpression'
        && DEFAULT_ACTION_NAMES.includes(path.node.callee.property.name)
        && path.parentPath.value.type !== 'AwaitExpression'
      ) {
        let parent = path.parent;
        while (parent.value.type !== 'ObjectMethod') {
          parent = parent.parent;
        } 

        parent.node.async = true;
        let awaition = j.awaitExpression(path.node);
        j(path).replaceWith(awaition);
      }
    })
    .toSource();
}