# Mastercard Postman Encryption Lib
Library for encrypting mastercard api requests in postman

## Usage
In postman :

 - Copy the contents of the [minified bundle](#build-the-minified-bundle-file) as an environment variable `encryptionScript` .
- Set the required environment variables for encryption
- Set this as a pre-request script:
```
    eval(pm.environment.get("encryptionScript"));
    // "jwe" for JWE encryption and "mce" for Mastercard encryption
    encryptRequest("jwe", pm); 
```
- Run the request.

## Development
##### Requires
    Node 18+
    npm 9+

##### Run unit tests

    npm test
 
 ##### Lint

    npm run lint

##### Fix linting errors

    npm run lint:fix 

##### Build the minified bundle file

    npm run minify

The output will be created in the `dist/` directory.  


## Contributing

Commit messages should follow [Angular Commit Message Conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines).  

If you're unfamiliar with this, instead of `git commit`, run:   

    npm run commit  

 and you'll get an interactive shell which will help you with the commit message. For example:  

    git add file1 file2  
    npm run commit


For more details, see [CONTRIBUTING](./CONTRIBUTING.md)

## Release Process  

On PR merge, release is handled automatically by the [semantic-release tool](https://github.com/semantic-release/semantic-release), which will :
  - Update the version in `package.json`
  - Update the [CHANGELOG](./CHANGELOG.md) using the commit messages
  - Create a [github release](https://github.com/Mastercard/postman-encryption-lib/releases) with the minified file.

