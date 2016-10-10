# Changelog

## 0.7.8 (10/09/2016)

**Implemented Enhancements**

- none

**Fixed Bugs**

- clear sw, it's broken

## 0.7.8 (09/25/2016)

**Implemented Enhancements**

- none

**Fixed Bugs**

- Updated manifest file
- Updated number of modlists
- Updated ignore list in `cache.sw.js`

## 0.7.7 (09/14/2016)

**Implemented Enhancements**

- none

**Fixed Bugs**

- Fixed broken download link

## 0.7.6 (09/14/2016)

**Implemented Enhancements**

- none

**Fixed Bugs**

- Fixed broken modlist sorting
- Moved sort button to input-group
- Added the profile button back into the nav

## 0.7.5 (09/05/2016)

**Implemented Enhancements**

- none

**Fixed Bugs**

- Added links to blog from home page

## 0.7.4 (09/04/2016)

**Implemented Enhancements**

- none

**Fixed Bugs**

- properly hid menu items

## 0.7.3 (09/04/2016)

**Implemented Enhancements**

- none

**Fixed Bugs**

- removed unnecessary home.module
- added home page content

## 0.7.2 (09/04/2016)

**Implemented Enhancements**

- none

**Fixed Bugs**

- refactored menu layout
- refactored css directories
- menu.css now uses variables (yay)

## 0.7.1 (08/21/2016)

**Implemented Enhancements**

- none

**Fixed Bugs**

- fixed missing game in profile page

## 0.7.0 (08/21/2016)

**Implemented Enhancements**

- added settings page
- profile link now goes to settings page
- logout works now

**Fixed Bugs**

- better handling of token response

## 0.6.2 (08/18/2016)

**Implemented Enhancements**

- none

**Fixed Bugs**

- fixed eslint errors in editor
- replaced download url with new redirect

## 0.6.1 (08/12/2016)

**Implemented Enhancements**

- none

**Fixed Bugs**

- replaced firebase with superstatic, removed deploy option

## 0.6.0 (08/10/2016)

**Implemented Enhancements**

- moved nav to fancy burger menu

**Fixed Bugs**

- none

## 0.5.0 (08/09/2016)

**Implemented Enhancements**

- add firebase serve and deploy to cli
- add promise return to run()

**Fixed Bugs**

- fix cli -- -w
  - replaced chokidar with graceful-fs.watch
- clean dev deps

## 0.4.2 (08/09/2016)

**Implemented Enhancements**

- none

**Fixed Bugs**

- refactored search in userlist page, still needs loading animation
- removed .btn color, was jacking up buttons
  - check for places that may have actually been used
- ignore firebase debug file

## 0.4.1 (08/09/2016)

**Implemented Enhancements**

- none

**Fixed Bugs**

- refactored login modal
- added header when no users found at /userlist

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
