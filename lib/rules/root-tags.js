'use strict';

const { List } = require('immutable');
const RuleFailure = require('../RuleFailure');

const rule = {
  description: 'enforce present and non-empty tags array',
  validate(options, schema) {
    if (schema.tags) {
      if (schema.tags.length > 0) {
        // success!
        return new List();
      }

      return new List().push(new RuleFailure({ location: 'tags', hint: 'Empty tags' }));
    }

    return new List().push(new RuleFailure({ location: 'tags', hint: 'Missing tags' }));
  }
};

module.exports = rule;
