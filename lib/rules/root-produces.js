'use strict';

const { List } = require('immutable');
const RuleFailure = require('../RuleFailure');

const rule = {
  description: 'enforce present and non-empty produces array',
  validate(options, schema) {
    if (schema.produces) {
      if (schema.produces.length > 0) {
        // success!
        return new List();
      }

      return new List().push(new RuleFailure({ location: 'produces', hint: 'Empty produces' }));
    }

    return new List().push(new RuleFailure({ location: 'produces', hint: 'Missing produces' }));
  }
};

module.exports = rule;
