const jose = require('node-jose');
const { validateEnv } = require('./util');

function jweEncryption(pm) {
  validateEnv(['pathToRawData', 'pathToEncryptedData', 'publicKeyFingerprint', 'encryptionCert'], pm.environment);

  return new Promise((resolve) => {
    const reqBody = JSON.parse(pm.request.body.raw);
    const pathToRawData = pm.environment.get('pathToRawData');
    const pathToEncryptedData = pm.environment.get('pathToEncryptedData');
    const encryptedProperty = pm.environment.get('encryptedProperty') ?? 'encryptedData';
    const publicKeyFingerprint = pm.environment.get('publicKeyFingerprint');
    const encryptionCertificate = pm.environment.get('encryptionCert');

    // Get element in payload to encrypt
    let tmpIn = reqBody;
    let prevIn = null;

    const paths = pathToRawData.split('.');
    paths.forEach((e) => {
      if (pathToRawData !== '$' && !Object.prototype.hasOwnProperty.call(tmpIn, e)) {
        tmpIn[e] = {};
      }
      prevIn = tmpIn;
      tmpIn = tmpIn[e];
    });
    const elem = pathToRawData.split('.').pop();
    const target = pathToRawData !== '$' ? prevIn[elem] : reqBody;

    // Get output path of encrypted payload
    let outPath = reqBody;
    const pathsOut = pathToEncryptedData.split('.');
    pathsOut.forEach((e) => {
      if (pathToEncryptedData !== '$' && !Object.prototype.hasOwnProperty.call(outPath, e)) {
        outPath[e] = {};
      }
      outPath = outPath[e];
    });

    const keystore = jose.JWK.createKeyStore();
    return (
      keystore
        .add(encryptionCertificate, 'pem', { kid: publicKeyFingerprint })

        // Encrypt payload and attach to request body
        .then((publicKey) => {
          const buffer = Buffer.from(JSON.stringify(target));
          return jose.JWE.createEncrypt(
            {
              format: 'compact',
              contentAlg: 'A256GCM',
              fields: { alg: 'RSA-OAEP-256', kid: publicKeyFingerprint, cty: 'application/json' },
            },
            publicKey,
          )
            .update(buffer)
            .final();
        })
        .then((encrypted) => {
          if (pathToEncryptedData !== '$') {
            outPath[encryptedProperty] = encrypted;
          } else {
            if (pathToRawData === '$') {
              const properties = Object.keys(reqBody);
              properties.forEach((e) => {
                delete reqBody[e];
              });
            }
            reqBody[encryptedProperty] = encrypted;
          }
          delete prevIn[elem];

          resolve(reqBody);
        })
    );
  });
}

module.exports = {
  jweEncryption,
};
