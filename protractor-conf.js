require("babel-register")({
    presets: ["env"]
});

var jasmineReporters = require('jasmine-reporters');
var fs = require('fs-extra');
var HTMLReport = require('protractor-html-reporter-2');

exports.config = {
    directConnect: true,

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        browserName: 'chrome',
        shardTestFiles: false,
        maxInstances: 1,
        specs: ['src/specs/*.spec.js'],

    },
    framework: 'jasmine2',

    baseUrl: 'http://automationpractice.com',

    // Options to be passed to Jasmine.
    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000,
        showColors: true,
    },
    onPrepare: () => {
        browser.waitForAngularEnabled(false);
        browser.driver.manage().window().maximize();
        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
            consolidateAll: true,
            savePath: 'results',
            filePrefix: 'xmlresults'
        }));

        //Function to empty screenshot directory
        fs.emptyDir('screenshots/', function (err) {
            console.log(err);
        });

        //Function to capture screenshot when test is failed
        jasmine.getEnv().addReporter({
            specDone: function (result) {
                if (result.status == 'failed') {
                    browser.getCapabilities().then(function (caps) {
                        var browserName = caps.get('browserName');

                        browser.takeScreenshot().then(function (png) {
                            var stream = fs.createWriteStream('screenshots/' + browserName + '-' + result.fullName + '.png');
                            stream.write(new Buffer(png, 'base64'));
                            stream.end();
                        });
                    });
                }
            }
        });
    },

    //HTMLReport called once tests are finished
    onComplete: function () {
        var browserName, browserVersion;
        var capsPromise = browser.getCapabilities();

        capsPromise.then(function (caps) {
            browserName = caps.get('browserName');
            browserVersion = caps.get('version');
            platform = caps.get('platform');

            testConfig = {
                reportTitle: 'Protractor Test Execution Report',
                outputPath: './',
                outputFilename: 'ProtractorTestReport',
                screenshotPath: 'screenshots',
                testBrowser: browserName,
                browserVersion: browserVersion,
                modifiedSuiteName: false,
                screenshotsOnlyOnFailure: true,
                testPlatform: platform
            };
            new HTMLReport().from('results/xmlresults.xml', testConfig);
        });
    },
};