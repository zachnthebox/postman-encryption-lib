# Contributing

When contributing to this repository, please first discuss the change you wish  
to make via an issue, be it a bug report, or feature request or anything else.

**Always check if the bug/feature request has been already raised before creating a new one.**

## Commit Message Conventions  
This repository follows [Angular Commit Message Conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines).  
If you're unfamiliar with this format, run:   
`npm run commit` instead of `git commit`  
 and you'll get an interactive shell which will help you. As an example:  

    git add file1 file2  
    npm run commit

**Commit messages are used by the release tool for publishing releases and will appear in the CHANGELOG, so make sure they're clear and sensible**


## Pull Request Process
1. Pull requests should be made against the main branch
2. Ensure there are no linting errors and that changes have unit tests.
4. You may merge the pull request if all checks pass and you have the approval from us.

**Do not update the version manually in `package.json`. Versioning is handled by the [release tool](./release.config.js). Same goes for the CHANGELOG.**