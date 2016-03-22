// SKYLIFT CONCEPT CODE
// COPYRIGHT (C) 2016 NEVADA_SCOUT [http://hvy.io/skylift]

const fs = require("fs");
const spawn = require('child_process').spawn;

var phpLocation = "E:/xampp/php/php";
var phpunitLocation = "phpunit-4.8.24.phar";
var outputFile = "testoutput.txt";
var testclass = "tests";

const bat = spawn('cmd.exe', ['/c', '${phpLocation} ${phpunitLocation} --log-json ${outputFile} ${testclass}']);

bat.on('exit', (code) => {
    parseOutput();
});

//bat.stdin.pause();
//bat.kill();

function parseOutput()
{
    var failedTests = [];

    fs.readFile(outputFile, "utf8", function (err, data) {
        if (err) {
            return console.error(err);
        }

        // Convert PHPUnit output into valid JSON
        var jsonstr = data.replace(/}{/gm, "},{");
        var testResults = JSON.parse("[" + jsonstr + "]");

        // Find failed tests
        testResults.filter(function(item){
            if (item.status != null && item.status === "fail") {
                failedTests.push(item);
            }
        });

        console.log(failedTests);
    });
}
