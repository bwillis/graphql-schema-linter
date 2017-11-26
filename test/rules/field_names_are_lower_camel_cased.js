import assert from 'assert';
import { parse } from 'graphql';
import { visit, visitInParallel } from 'graphql/language/visitor';
import { validate } from 'graphql/validation';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';

import { FieldNamesAreLowerCamelCased } from '../../src/rules/field_names_are_lower_camel_cased';

describe('FieldNamesAreLowerCamelCased rule', () => {
  it('catches fields that are not lower camel cased', () => {
    const ast = parse(`
      type Query {
        Invalid: String
        not_valid: String
        _not_valid: String

        valid: String
        isValid: String
      }

      interface Thing {
        Invalid: String
        not_valid: String
        _not_valid: String

        valid: String
        isValid: String
      }
    `);

    const schema = buildASTSchema(ast);
    const errors = validate(schema, ast, [FieldNamesAreLowerCamelCased]);

    assert.equal(errors.length, 6);

    assert.equal(
      errors[0].message,
      'The field `Query.Invalid` should begin with a lower cased letter.'
    );
    assert.deepEqual(errors[0].locations, [{ line: 3, column: 9 }]);

    assert.equal(
      errors[1].message,
      'The field `Query.not_valid` should not have underscores. Use lower camel case instead.'
    );
    assert.deepEqual(errors[1].locations, [{ line: 4, column: 9 }]);

    assert.equal(
      errors[2].message,
      'The field `Query._not_valid` should begin with a lower cased letter.'
    );
    assert.deepEqual(errors[2].locations, [{ line: 5, column: 9 }]);

    assert.equal(
      errors[3].message,
      'The field `Thing.Invalid` should begin with a lower cased letter.'
    );
    assert.deepEqual(errors[3].locations, [{ line: 12, column: 9 }]);

    assert.equal(
      errors[4].message,
      'The field `Thing.not_valid` should not have underscores. Use lower camel case instead.'
    );
    assert.deepEqual(errors[4].locations, [{ line: 13, column: 9 }]);

    assert.equal(
      errors[5].message,
      'The field `Thing._not_valid` should begin with a lower cased letter.'
    );
    assert.deepEqual(errors[5].locations, [{ line: 14, column: 9 }]);
  });
});
