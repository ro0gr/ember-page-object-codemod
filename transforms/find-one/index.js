const { getParser } = require('codemod-cli').jscodeshift;
// const { getOptions } = require('codemod-cli');

const ROOT_SOURCE_PATH = 'ember-cli-page-object';
const EXTEND_SOURCE_PATH = 'ember-cli-page-object/extend';

module.exports = function transformer(file, api) {
  const j = getParser(api);

  if (!findElementWithAssertImports(j, file.source).length) {
    return file.source;
  }

  let source = findCalls(j, file.source, 'findElementWithAssert')
    .forEach(path => {
      const { parent } = path;

      // Replace `findElementWithAssert(...).get(0)`
      if (
        parent.node.type === 'MemberExpression' &&
        parent.node.property.name === 'get' &&
        parent.parent.node.type === 'CallExpression'
      ) {
        const getCall = parent.parent;
        if (
          getCall.node.arguments.length === 1 &&
          getCall.node.arguments[0].type === 'NumericLiteral' &&
          getCall.node.arguments[0].value === 0
        ) {
          path.node.callee.name = 'findOne';
          getCall.replace(path.node);
        }
      }

      // Replace `findElementWithAssert(...)[0]`
      if (
        parent.node.type === 'MemberExpression' &&
        parent.node.property.type === 'NumericLiteral' &&
        parent.node.property.value === 0
      ) {
        path.node.callee.name = 'findOne';
        parent.replace(path.node);
      }
    })
    .toSource();

  const findOneCalls = findCalls(j, source, 'findOne');

  const extendImports = j(source)
    .find(j.ImportDeclaration)
    .filter(p => {
      return EXTEND_SOURCE_PATH === p.value.source.value;
    });

  const findOneImports = extendImports.filter(p => {
    return p.value.specifiers.some(s => s.imported.name === 'findOne');
  });

  if (findOneCalls.length && !findOneImports.length) {
    const findOneSpecifier = j.importSpecifier(j.identifier('findOne'));

    if (extendImports.length) {
      source = extendImports
        .forEach(p => {
          p.value.specifiers.push(findOneSpecifier);
        })
        .toSource();
    } else {
      const newExtendImport = j.importDeclaration(
        [findOneSpecifier],
        j.literal(EXTEND_SOURCE_PATH)
      );

      const root = j(source);
      let body = root.get().value.program.body;
      body.unshift(newExtendImport);

      source = root.toSource();
    }
  }

  // cleanup unused import specifiers
  const findElementWithAssertCalls = findCalls(j, source, 'findElementWithAssert');
  if (findElementWithAssertCalls.length === 0) {
    source = findElementWithAssertImports(j, source)
      .forEach(p => {
        j(p)
          .find(j.ImportSpecifier)
          .forEach(impSpecNodePath => {
            if (impSpecNodePath.node.imported.name === 'findElementWithAssert') {
              // j.importSpecifier(j.indentifier('findIne'));
              j(impSpecNodePath).remove();
            }
          });
      })
      .toSource();
  }

  // cleanup empty imports
  return j(source)
    .find(j.ImportDeclaration)
    .filter(p => {
      return (
        [ROOT_SOURCE_PATH, EXTEND_SOURCE_PATH].includes(p.value.source.value) &&
        p.value.specifiers.length === 0
      );
    })
    .remove()
    .toSource();
};

function findCalls(j, root, name) {
  return j(root)
    .find(j.CallExpression)
    .filter(p => {
      return p.node.callee.type == 'Identifier' && p.node.callee.name === name;
    });
}

function findElementWithAssertImports(j, source) {
  return j(source)
    .find(j.ImportDeclaration)
    .filter(p => {
      return [EXTEND_SOURCE_PATH, ROOT_SOURCE_PATH].includes(p.value.source.value);
    })
    .filter(p => {
      return (
        j(p)
          .find(j.ImportSpecifier)
          .filter(impSpecNodePath => {
            return impSpecNodePath.node.imported.name === 'findElementWithAssert';
          }).length > 0
      );
    });
}
