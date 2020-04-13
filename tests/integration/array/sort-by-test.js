import { sortBy } from 'ember-awesome-macros/array';
import EmberObject, { computed } from '@ember/object';
import { A as emberA } from '@ember/array';
import { module, test } from 'qunit';
import { compute } from 'ember-macro-helpers/test-support';
import sinon from 'sinon';

module('Integration | Macro | array | sortBy', function() {
  test('it throws error when key is not defined', function(assert) {
    assert.throws(() => compute({ computed: sortBy('array') }), TypeError);
  });

  test('it throws error when key is not a string', function(assert) {
    assert.throws(() => sortBy('array', () => {}), TypeError);
    assert.throws(() => sortBy('array', {}), TypeError);
    assert.throws(() => sortBy('array', 42), TypeError);
  });

  test('it return undefined when array is undefined', function(assert) {
    compute({
      assert,
      computed: sortBy('array', 'key'),
      strictEqual: undefined
    });
  });

  test('sorts array in ascending order by default', function(assert) {
    compute({
      assert,
      computed: sortBy('array', 'key2'),
      properties: {
        array: emberA([
          {
            key1: 'abc',
            key2: 'abc'
          },
          {
            key1: 'abc',
            key2: 'xyz'
          }
        ])
      },
      deepEqual: [
        {
          key1: 'abc',
          key2: 'abc'
        },
        {
          key1: 'abc',
          key2: 'xyz'
        }
      ]
    });
  });

  test('it should sort array in descending order', function(assert) {
    compute({
      assert,
      computed: sortBy('array', 'key2:desc'),
      properties: {
        array: emberA([
          {
            key1: 'abc',
            key2: 'abc'
          },
          {
            key1: 'abc',
            key2: 'xyz'
          }
        ])
      },
      deepEqual: [
        {
          key1: 'abc',
          key2: 'xyz'
        },
        {
          key1: 'abc',
          key2: 'abc'
        }
      ]
    });
  });

  test('it does not sort the source array for default property sorts', function(assert) {
    let array = [{ prop: 1 }, { prop: 3 }, { prop: 2 }];
    compute({
      assert,
      computed: sortBy('array', 'prop'),
      properties: {
        array
      },
      deepEqual: [{ prop: 1 }, { prop: 2 }, { prop: 3 }]
    });
    assert.deepEqual(array, [{ prop: 1 }, { prop: 3 }, { prop: 2 }]);
  });

  test('it does not sort the source array for property sorts', function(assert) {
    let array = [{ prop: 1 }, { prop: 3 }, { prop: 2 }];
    compute({
      assert,
      computed: sortBy('array', 'prop:desc'),
      properties: {
        array
      },
      deepEqual: [{ prop: 3 }, { prop: 2 }, { prop: 1 }]
    });
    assert.deepEqual(array, [{ prop: 1 }, { prop: 3 }, { prop: 2 }]);
  });

  test('it responds to array property value changes', function(assert) {
    let array = emberA([
      EmberObject.create({ prop: 2 }),
      EmberObject.create({ prop: 1 })
    ]);

    let { subject } = compute({
      computed: sortBy('array.@each.prop', 'prop'),
      properties: {
        array
      }
    });

    assert.deepEqual(emberA(subject.get('computed')).mapBy('prop'), [1, 2]);

    array.set('1.prop', 3);

    assert.deepEqual(emberA(subject.get('computed')).mapBy('prop'), [2, 3]);

    array.pushObject(EmberObject.create({ prop: 1 }));

    assert.deepEqual(emberA(subject.get('computed')).mapBy('prop'), [1, 2, 3]);
  });

  test('doesn\'t calculate when unnecessary', function(assert) {
    let callback = sinon.spy();

    compute({
      computed: find(
        undefined,
        computed(callback)
      )
    });

    assert.notOk(callback.called);
  });
});
