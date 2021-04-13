'use strict';

const _ = require('lodash');

const { List } = require('immutable');
const constants = require('../constants');
const RuleFailure = require('../RuleFailure');

const rule = {
  description: 'enforce path parameter parity',
  validate(options, schema) {
    const errorList = [];

    if (schema.paths) {
      Object.keys(schema.paths).forEach((pathKey) => {
        const path = schema.paths[pathKey];

        // check each operation
        Object.keys(_.pick(path, constants.httpMethods)).forEach((operationKey) => {
          const operation = path[operationKey];

          if (operation.parameters) {
            operation.parameters.forEach((parameter, parameterIndex) => {
              if (parameter.required && !!parameter.default) {
                errorList.push(new RuleFailure(
                  {
                    location: `paths.${pathKey}.${operationKey}.parameters[${parameterIndex}]`,
                    hint: 'Expected required parameter to not have a default value.'
                  }
                ));
              }
            });
          }
        });
      });
    }

    return new List(errorList);
  }
};

module.exports = rule;
