'use strict';

const inquirer = require('inquirer'),
    CLI = require('clui'),
    request = require('request'),
    chalk = require('chalk'),
    Spinner = CLI.Spinner,

    GoogleDistanceMatrixApiKey = 'AIzaSyDFzO246uTdVRSosU3NshoY25gJMPodRP8';

function searchLocationDistance(callback) {

    var questions = [{
            type: 'input',
            name: 'origin',
            message: 'From which location: ',
            validate: function(value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter a location';
                }
            }
        },

        {
            type: 'input',
            name: 'destination',
            message: 'To which location: ',
            validate: function(value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter a location';
                }
            }
        }

    ];

    inquirer.prompt(questions).then(callback);
}


function getLocationDistance(origin, destination) {
    var status = new Spinner('Connecting to the server, please wait...');
    status.start()

    var encodedOrigin = encodeURIComponent(origin),
        encodedDestination = encodeURIComponent(destination);

    request({
        url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodedOrigin}&destinations=${encodedDestination}&key=${GoogleDistanceMatrixApiKey}`,
        json: true
    }, function(error, response, body) {

        if (error) {
            console.log(chalk.red.bold('\nUnable to connect to Google servers.'));
        } else if (body.status === "NOT_FOUND") {
            console.log(chalk.red.bold('\nOrigin and/or destination of this pairing could not be geocoded.\n'));
        } else if (body.status === 'ZERO_RESULTS') {
            console.log(chalk.red.bold('\nLocations not fount'));
        } else if (body.status === 'OVER_QUERY_LIMIT') {
            console.log(chalk.red.bold('\nDaily request quota exceeded'));
        } else if (body.status === 'OK' && body.rows[0].elements[0].status === 'OK') {
            console.log(chalk.dim.gray('\n========================================'));
            console.log(chalk.bold.yellow('From: ', body.origin_addresses[0]));
            console.log(chalk.bold.yellow('To: ', body.destination_addresses[0]));
            console.log(chalk.bold.green('Distance: ', body.rows[0].elements[0].distance.text));
            console.log(chalk.bold.green('Duration: ', body.rows[0].elements[0].duration.text));
            console.log(chalk.dim.gray('=========================================='));
        } else {
            console.log(chalk.red.bold('\nLocations not fount'));
        }
        status.stop();
    });
}

//status.stop();

module.exports = {
    searchLocationDistance: searchLocationDistance,
    getLocationDistance: getLocationDistance
};