// Configuration for the semantic-release tool

module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      // publish a release on github
      '@semantic-release/github',
      {
        assets: [
          { path: 'dist/mastercard-postman-encryption-lib.min.js', label: 'mastercard-postman-encryption-lib.min.js' },
        ],
      },
    ],
    '@semantic-release/changelog',
    [
      // update the version in package.json file
      '@semantic-release/npm',
      {
        npmPublish: false, // do not publish to the npm registry
      },
    ],
    [
      // commit the files updated by the plugins above
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]',
      },
    ],
  ],
  dryRun: true,
};
