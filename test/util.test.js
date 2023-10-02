const { validateEnv } = require('../src/util');

describe(`Tests for ${validateEnv.name}()`, () => {
  test('Throws when environment variables are missing', () => {
    const environment = new Map(Object.entries({ dummy: 'value' }));
    const requiredVariables = ['anotherDummy'];

    expect(() => validateEnv(requiredVariables, environment)).toThrow();
  });

  test('Does not throw when environment variables are available', () => {
    const environment = new Map(Object.entries({ dummy: 'value' }));
    const requiredVariables = ['dummy'];

    expect(() => validateEnv(requiredVariables, environment)).not.toThrow();
  });
});
