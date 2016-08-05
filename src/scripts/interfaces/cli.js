#!/usr/bin/env node
"use strict";

import program from "commander";
import ora from "ora";
import keypress from "keypress";

import { run } from "../lib/utils";

program
.option("-m, --minify", "Minify")
.option("-j, --javascript", "Build Javascript")
.option("-c, --css", "Build CSS")
.option("-s, --serviceworkers", "Build Service Workers")
.option("-a, --all", "All (JS, CSS)")
.option("-w, --watch", "Watch for Changes")
.parse(process.argv);

const restingSpinnerMessage = "Watching: `Q` to quit";
const spinner = ora(restingSpinnerMessage);

if(program.watch) {
  if(program.post) {
    console.log("Can't watch and post at the same time");
    process.exit(0);
  }
  spinner.start();
  keypress(process.stdin);
}
run(Object.assign({}, program, {
  building(args) {
    spinner.color = "yellow";
    spinner.text = `Building ${args.prettyName}`;
  },
  goodWatch(args) {
    spinner.color = "white";
    spinner.text = restingSpinnerMessage;
  },
  badWatch(e, args) {
    console.log(`\n:: Watch Error: ${e.message}`);
    spinner.color = "red";
    spinner.text = `Error Building ${args.prettyName}`;
  },
  onquit(stopWatching) {
    process.stdin.on("keypress", (ch, key) => {
      if (key && (key.name === "q" || (key.ctrl && key.name === "c"))) {
        spinner.stop();
        stopWatching();
        process.exit(0);
      }
    });
  }
}));

if(program.watch) {
  process.stdin.setRawMode(true);
  process.stdin.resume();
}
