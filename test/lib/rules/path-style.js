'use strict';

const { assert } = require('chai');
const pathStyleRule = require('../../../lib/rules/path-style');

describe('path-style', () => {
  const spineCaseOptions = { case: 'spine' };
  const capSpineCaseOptions = { case: 'cap-spine' };
  const snakeCaseOptions = { case: 'snake' };
  const anyCaseOptions = { case: 'any' };

  it('should not report errors for no paths', () => {
    const schema = { paths: { } };
    const failures = pathStyleRule.validate(spineCaseOptions, schema);

    assert.equal(failures.size, 0);
  });

  it('should not report errors when the paths match the spine case', () => {
    const schema = { paths: { '/first/{id}/second-third': {}, '/fourth': {} } };
    const failures = pathStyleRule.validate(spineCaseOptions, schema);

    assert.equal(failures.size, 0);
  });

  it('should not report errors when the paths match the cap-spine case', () => {
    const schema = { paths: { '/FIRST/{id}/SECOND-THIRD': { }, '/FOURTH': {} } };
    const failures = pathStyleRule.validate(capSpineCaseOptions, schema);

    assert.equal(failures.size, 0);
  });

  it('should not report errors when the paths match the snake case', () => {
    const schema = { paths: { '/first/{id}/second_third': {} } };
    const failures = pathStyleRule.validate(snakeCaseOptions, schema);

    assert.equal(failures.size, 0);
  });

  it('should not report errors when the paths match the any case', () => {
    const schema = { paths: { '/fiRsT/{id}/AFDS_0-awer': {} } };
    const failures = pathStyleRule.validate(anyCaseOptions, schema);

    assert.equal(failures.size, 0);
  });

  it('should not report errors when the paths is just a slash', () => {
    const schema = { paths: { '/': {} } };
    const failures = pathStyleRule.validate(spineCaseOptions, schema);

    assert.equal(failures.size, 0);
  });

  it('should report an error when the config is not properly specified', () => {
    const badConfigRuleFunction = () => {
      const schema = {};

      pathStyleRule.validate({}, schema);
    };

    assert.throws(badConfigRuleFunction, Error, 'Invalid config specified');
  });

  it('should report an error for a path without a starting slash', () => {
    const schema = { paths: { pets: { } } };

    const failures = pathStyleRule.validate(spineCaseOptions, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths.pets');
    assert.equal(failures.get(0).get('hint'), 'Missing a leading slash');
  });

  it('should report an error for a path not matching the case', () => {
    const schema = { paths: { '/badCase': { } } };

    const failures = pathStyleRule.validate(spineCaseOptions, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./badCase');
    assert.equal(failures.get(0).get('hint'), '"badCase" does not comply with case: "spine"');
  });

  it('should report an error for two slashes together', () => {
    const schema = { paths: { '/pets//food': { } } };

    const failures = pathStyleRule.validate(spineCaseOptions, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./pets//food');
    assert.equal(failures.get(0).get('hint'), 'Must not have empty path elements');
  });

  it('should report an error for a path with a trailing slash', () => {
    const schema = { paths: { '/pets/': { } } };

    const failures = pathStyleRule.validate(spineCaseOptions, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./pets/');
    assert.equal(failures.get(0).get('hint'), 'Must not have a trailing slash');
  });

  it('should report an error for a path with invalid path params', () => {
    const schema = { paths: { '/incomplete-param/{id/more-stuff': { } } };

    const failures = pathStyleRule.validate(spineCaseOptions, schema);

    assert.equal(failures.size, 1);
    assert.equal(failures.get(0).get('location'), 'paths./incomplete-param/{id/more-stuff');
    assert.equal(failures.get(0).get('hint'), '"{id" does not comply with case: "spine"');
  });

  it('should report errors for a path with invalid path params', () => {
    const schema = { paths: { '/another-invalid-param/{id/more-stuff}': { } } };

    const failures = pathStyleRule.validate(spineCaseOptions, schema);

    assert.equal(failures.size, 2);
    assert.equal(failures.get(0).get('location'), 'paths./another-invalid-param/{id/more-stuff}');
    assert.equal(failures.get(0).get('hint'), '"{id" does not comply with case: "spine"');
    assert.equal(failures.get(1).get('location'), 'paths./another-invalid-param/{id/more-stuff}');
    assert.equal(failures.get(1).get('hint'), '"more-stuff}" does not comply with case: "spine"');
  });
});
