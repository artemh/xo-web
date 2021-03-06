# Xen Orchestra Web [![Build Status](https://travis-ci.org/vatesfr/xo-web.png?branch=master)](https://travis-ci.org/vatesfr/xo-web)

![](http://i.imgur.com/tRffA5y.png)

XO-Web is part of [Xen Orchestra](https://github.com/vatesfr/xo), a web interface for XenServer or XAPI enabled hosts.

It is a web client for [XO-Server](https://github.com/vatesfr/xo-server).

___

## Installation

XOA or manual install procedure is [available here](https://github.com/vatesfr/xo/blob/master/doc/installation/README.md)

## Compilation

Production build:

```
$ npm run build
```

Development build:

```
$ npm run dev
```

## How to report a bug?

If you are certain the bug is exclusively related to XO-Web, you may use the [bugtracker of this repository](https://github.com/vatesfr/xo-web/issues).

Otherwise, please consider using the [bugtracker of the general repository](https://github.com/vatesfr/xo/issues).

## Process for new release

```bash
# Switch to the master branch.
git checkout master

# Fetches latest changes.
git pull --ff-only

# Merge changes of the next-release branch.
git merge next-release

# Increment the version (patch, minor or major).
npm version minor

# Go back to the next-release branch.
git checkout next-release

# Fetches the last changes (the merge and version bump) from master to
# next-release.
git merge --ff-only master

# Push the changes on git.
git push --follow-tags origin master next-release

# Publish this release to npm.
npm publish
```

## License

AGPL3 © [Vates SAS](http://vates.fr)
