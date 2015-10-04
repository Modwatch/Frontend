[![Build Status](https://travis-ci.org/ansballard/SkyrimModWatcher.svg?branch=master)](https://travis-ci.org/ansballard/SkyrimModWatcher)

TO BUILD
==

### Dependencies

1. [NodeJS/NPM](https://nodejs.org) (Latest Stable Version)
2. [Bower](http://bower.io) (`sudo npm install -g bower`)
3. [Gulp](http://gulpjs.com) (`sudo npm install -g gulp`)

### Setup

1. `cd` to this directory
2. `npm install`
3. `bower install`
4. `gulp`
5. `npm start`

GENERAL
==

This site is a barebones MEAN stack web server without the M(ongo). It gets data from a decoupled [API server](http://github.com/ansballard/modwatchapi). The build system is GulpJS, frontend dependencies are handled with Bower (for now), and once I get to unit tests, they'll be written in karma/jasmine.

The frontend framework being used is Angular 1.x. Currently the goal for the Angular code is to move to the [John Papa styleguide](https://github.com/johnpapa/angular-styleguide). This will allow for much more modular code, and a cleaner path to Angular 2.

Bootstrap 3 is the CSS library I use. I may move to Bootstrap 4 when it's stable, since I don't really worry about old browser support unless someone asks for it.

CONTRIBUTING
==

1. Fork this repo
2. Open an issue for the problem/enhancement you want to work on
3. Create a branch that has to do with the issue you want to fix
4. Implement your changes
5. Make a pull request to this repo
6. If there are no merge conflicts, and I've already approved the issue you created, I'll most likely merge your changes in

When making changes, do your best to follow the standards already set in other parts of the repo. Changes should not be noticeable when looking through source code. I would prefer all changes pass `eslint` with the `.eslintrc` in the root directory.

LINKS
==

- [The Live Site](http://www.modwat.ch)
- [The Nexus Mods Page](http://nexusmods.com/skyrim/mods/56640)
- [The API](http://github.com/ansballard/modwatchapi)
- [The Uploader](http://github.com/ansballard/modwatchuploader)
