'use strict';

const { Record } = require('immutable');

class RuleFailure extends Record({ location: '', hint: '' }) {

}

module.exports = RuleFailure;
