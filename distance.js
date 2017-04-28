#! /usr/bin/env node

"use strict";

const figlet = require('figlet'),
    chalk = require('chalk'),
    lib = require('./lib/lib');

figlet('DIST-CALC', function(err, data) {
    if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
    }
    console.log();
    console.log(chalk.gray(data));
    console.log();

    lib.searchLocationDistance(function(result) {
        var origin = result.origin,
            destination = result.destination;
        lib.getLocationDistance(origin, destination);
    });
})