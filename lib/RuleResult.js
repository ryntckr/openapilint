'use strict';

const { Record } = require('immutable');
const { List } = require('immutable');

class RuleResult extends Record({ description: '', failures: new List() }) {

}

module.exports = RuleResult;
