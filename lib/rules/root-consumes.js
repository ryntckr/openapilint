'use strict';

const { List } = require('immutable');
const RuleFailure = require('../RuleFailure');

const rule = {
  description: 'enforce present and non-empty consumes array',
  validate(options, schema) {
    if (schema.consumes) {
      if (schema.consumes.length > 0) {
        // success!
        return new List();
      }

      return new List().push(new RuleFailure({ location: 'consumes', hint: 'Empty consumes' }));
    }

    return new List().push(new RuleFailure({ location: 'consumes', hint: 'Missing consumes' }));
  }
};

module.exports = rule;
