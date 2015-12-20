TO BUILD
==

### Dependencies

1. [NodeJS/NPM](https://nodejs.org) (Latest Stable Version)

### Setup

1. Open a terminal/command prompt
2. `cd` to this directory
3. `npm install`
4. `npm start`

GENERAL
==

This site is a barebones MEAN stack web server without the M(ongo). It gets data from a decoupled [API server](http://github.com/ansballard/modwatchapi). The build system is uses NPM scripts to run browserify, which keeps it as simple as possible for building on the server.

The frontend framework being used is Angular `1.4.x`. Currently the goal for the Angular code is to move to the [John Papa styleguide](https://github.com/johnpapa/angular-styleguide). This will allow for much more modular code, and a cleaner path to Angular 2.

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
