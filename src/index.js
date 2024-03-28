/**
The MIT License (MIT)
 
Copyright (c) 2023 Mastercard
 
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
 
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

// required for postman
window = {};
const { mastercardEncryption } = require('./mce');
const { jweEncryption } = require('./jwe');

/**
 * Encrypt a request.
 * @param encryptionType The encryption to perform. Either "jwe" or "mce".
 * @param pm The postman object.
 */
// postman is unable to recognize 'encryptRequest' variable unless it's in global scope.
// eslint-disable-next-line no-undef
encryptRequest = async function (encryptionType, pm) {
  if (typeof encryptionType !== 'string' || !['jwe', 'mce'].includes(encryptionType)) {
    // throwing errors doesn't seem to be working in postman for some reason, so log the error so the user knows
    console.error("encryptionType can only be either of 'jwe' or 'mce'");
    throw new Error("encryptionType can only be either of 'jwe' or 'mce'");
  }

  if (typeof pm !== 'object' || pm == null) {
    console.error("'pm' object is invalid");
    throw new Error("'pm' object is invalid");
  }

  if (['get', 'head', 'delete', 'options'].includes(pm.request.method.toLowerCase())) {
    return;
  }

  const encryptedPayload = encryptionType === 'jwe' ? await jweEncryption(pm) : mastercardEncryption(pm);

  pm.request.body.update(JSON.stringify(encryptedPayload));
};
