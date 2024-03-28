/* global encryptRequest */ // for eslint

const { mastercardEncryption } = require('../src/mce');
const { jweEncryption } = require('../src/jwe');
require('../src/index');

jest.mock('../src/mce');
jest.mock('../src/jwe');

describe(`Tests for ${encryptRequest.name}()`, () => {
  // the postman object
  const pm = {};
  beforeEach(() => {
    pm.request = { method: 'post', body: {} };
  });

  test('Throws when encryptionType param is invalid', async () => {
    const mockUpdateFn = jest.fn();
    pm.request.body.update = mockUpdateFn;

    await expect(encryptRequest('invalid-encryption-type', pm)).rejects.toThrow();

    expect(mastercardEncryption).not.toHaveBeenCalled();
    expect(jweEncryption).not.toHaveBeenCalled();
    expect(mockUpdateFn).not.toHaveBeenCalled();
  });

  test('Throws when the postman object param is invalid', async () => {
    const mockUpdateFn = jest.fn();
    pm.request.body.update = mockUpdateFn;

    await expect(encryptRequest('jwe', undefined)).rejects.toThrow();

    expect(mastercardEncryption).not.toHaveBeenCalled();
    expect(jweEncryption).not.toHaveBeenCalled();
    expect(mockUpdateFn).not.toHaveBeenCalled();
  });

  test('Does not encrypt for http methods without bodies', async () => {
    const mockUpdateFn = jest.fn();
    pm.request.body.update = mockUpdateFn;

    for (const method of ['GET', 'head', 'OPTIONS', 'delete']) {
      pm.request = { method };
      await encryptRequest('mce', pm);
      expect(mastercardEncryption).not.toHaveBeenCalled();
      expect(jweEncryption).not.toHaveBeenCalled();
      expect(mockUpdateFn).not.toHaveBeenCalled();
    }
  });

  test('Performs mastercard encryption', async () => {
    const mockUpdateFn = jest.fn();
    pm.request.body.update = mockUpdateFn;

    const expectedResponse = 'expectedResponse';
    mastercardEncryption.mockReturnValue(expectedResponse);

    await encryptRequest('mce', pm);

    expect(mastercardEncryption).toHaveBeenCalled();
    expect(jweEncryption).not.toHaveBeenCalled();
    expect(mockUpdateFn).toHaveBeenCalledWith(JSON.stringify(expectedResponse));
  });

  test('Performs jwe encryption', async () => {
    const mockUpdateFn = jest.fn();
    pm.request.body.update = mockUpdateFn;

    const expectedResponse = 'expectedResponse';
    jweEncryption.mockReturnValue(expectedResponse);

    await encryptRequest('jwe', pm);

    expect(jweEncryption).toHaveBeenCalled();
    expect(mastercardEncryption).not.toHaveBeenCalled();
    expect(mockUpdateFn).toHaveBeenCalledWith(JSON.stringify(expectedResponse));
  });
});
