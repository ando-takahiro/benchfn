(function(global) {
    'use strict';

    var _BROWSER = !!global.self;
    var _WORKER  = !!global.WorkerLocation;
    var _NODE_JS = !!global.global;
    var exports;

    //<YOUR CODE>
    //node.js style module definition
    var now = function () {return +(new Date());};
    if (_NODE_JS) {
        try {
            var microtime = require('microtime');
            now = function () {
                return microtime.now() / 1000;
            };
        } catch (e) {
        }
    }

    var benchfn = exports = function benchfn(tests, stepReport, done) {
        var TESTS = benchfn.TESTS;
        var DELAY = benchfn.DELAY;
        var results = [];
        function stepTest(current) {
            function doNext(sum, count) {
                ++count;
                if (count < TESTS) {
                    setTimeout(function () {
                        step(count, sum);
                    }, DELAY);
                } else {
                    stepReport(current, sum, tests);
                    results.push(sum);
                    ++current;
                    if (current < tests.length) {
                        setTimeout(function () {
                            stepTest(current);
                        }, DELAY);
                    } else {
                        done(null, results);
                    }
                }
            }

            function step(count, sum) {
                try {
                    var begin = now();
                    tests[current](function (e) {
                        var end = now();
                        if (e) {
                            done(e);
                            return;
                        }
                        doNext(sum + end - begin, count);
                    });
                } catch (e) {
                    done(e);
                }
            }

            step(0, 0);

        }

        stepTest(0);
    };

    benchfn.TESTS = 100;
    benchfn.DELAY = 0;
    //</YOUR CODE>

    if (_NODE_JS) {
        module.exports = exports;
    } else {
        global.benchfn = exports;
    }
})(this.self || global);
