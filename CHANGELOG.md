# Changelog

## 0.4.1 (08/09/2016)

**Implemented Enhancements**

- none

**Fixed Bugs**

- refactored login modal
- added header when no users foud at /userlist

## 0.4.0 (08/08/2016)

**Implemented Enhancements**

- moved search functionality to userlist route
- removed ngAnimate
- added user and mod queries to userlist page
- added options to APIService.getUsers (querying, limiting)
- turned on serviceworkers
- removed uncss (for now) in favor of bootstrap CDN
- removed angular refs in favor of CDN

**Fixed Bugs**

- fixed header font size

## 0.3.0 (08/07/2016)

**Implemented Enhancements**

- switch to firebase hosting
- remove express code
- dev server with `http-server`
- modals are all now bindToController
- service maps to `.data`
- es6 where I found old code
- fixed uncss where it missed things (modals, fade)
- split out css
- fixed api calls on basically everything
- removed unused assets

**Fixed Bugs**

- replace rollup with browserify

## 0.2.0 (08/03/2016)

**Implemented Enhancements**

- actual build system
- config for deploying to new node on openshift

**Fixed Bugs**

- none

## 0.1.0 (9/30/2015)

**Implemented Enhancements**

- Added Changelog
- Refactored Readme
 - `node start` to `npm start`

**Fixed Bugs**

- Modals all pointed to the home view
