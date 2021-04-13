'use strict';

const { List } = require('immutable');

const RuleFailure = require('../RuleFailure');
const TextParser = require('../helpers/TextParser');

const rule = {
  description: 'enforce certain words or phrases are not included in text fields, including title, summary, or description',

  validate(options, schema) {
    const normalizedOptions = options || {};
    const normalizedRestrictedWords = normalizedOptions.words || [];

    if (normalizedRestrictedWords.length === 0) {
      return new List([]);
    }

    const errorList = [];
    const myTextParser = new TextParser(schema, errorList);
    const applyTo = ['description', 'summary', 'title'];

    myTextParser.forEachTextField(applyTo, (field, pathToField) => {
      normalizedRestrictedWords.forEach((word) => {
        if (new RegExp(`\\b${word}\\b`, 'i').test(field)) {
          errorList.push(new RuleFailure({
            location: pathToField,
            hint: `Found '${field}'`
          }));
        }
      });
    });

    return new List(errorList);
  }
};

module.exports = rule;
