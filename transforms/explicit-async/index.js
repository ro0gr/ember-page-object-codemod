const { getParser } = require('codemod-cli').jscodeshift;

function isAwaitCall(path) {
  let parent = path.parent;
  do {
    if (parent.value.type === 'AwaitExpression') {
      return true;
    }

    parent = parent.parent;
  } while (parent) 

  return false;
}

module.exports = function transformer(file, api) {
  const j = getParser(api);

  return j(file.source)
    .find(j.CallExpression)
    .forEach(path => {
      if (
        path.node.callee.type === 'MemberExpression'
        && !isAwaitCall(path)
      ) {
        let parent = path.parent;
        do {    
          if (parent.value.type === 'ObjectMethod') {
            parent.node.async = true;

            let awaition = j.awaitExpression(path.node);
            j(path).replaceWith(awaition);

            break;
          }
        } while (parent = parent.parent)
      }
    })
    .toSource();
}