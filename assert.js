const assert = require('assert');

/// Move me to package
let _tests = [];

const it = (fn) => {
  _tests.push(fn);
}

const strip = (s) => {
  return s.replace(/\n+/g, ' ').replace(/\s+/g, ' ')
}

const tests = {
  dispatch() {
    const serialized = JSON.stringify(tests.run());
    console.log(serialized);
  },

  run() {
    for (const test of _tests) {
      try {
        test();
      } catch (e) {
        if (e instanceof hassert.AssertionError) {
          switch (typeof e.expected) {
            case 'boolean':
              return {
                isSuccess: false,
                message: e.actual.toString()
              }
            default:
              return {
                isSuccess: false,
                message: strip(e.message)
              }
          }
        }
        return {
          isSuccess: false,
          message: `${e.name}: ${strip(e.message)}`
        }
      }
    }

    return {
      isSuccess: true,
      message: "true"
    }
  }
}

const hassert = {
  equal(arr, expected, message) {
    const [f, ...args] = arr;
    const actual = f(args);
    const defaultMessage = `Expected \`${f.name}(${args}) == ${expected}\`, not \`${actual}\``;

    assert.equal(actual, expected, message || defaultMessage);
  },

  deepEqual(arr, expected, message) {
    const [f, ...args] = arr;
    const actual = f(args);
    const defaultMessage = `Expected \`${f.name}(${args}) == ${expected}\`, not \`${actual}\``;

    assert.deepEqual(f(args), expected, message || defaultMessage);
  }
}

module.exports = {
  it,
  tests,
  hassert,
  assert
}
