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

    var benchfn = exports = function benchfn(suites, stepReport, done) {
        var REPEAT = benchfn.REPEAT;
        var DELAY = benchfn.DELAY;
        var results = [];
        function suite(current) {
            function afterStepReport() {
                ++current;
                if (current < suites.length) {
                    setTimeout(function () {
                        suite(current);
                    }, DELAY);
                } else {
                    done(null, results);
                }
            }

            function next(sum, count) {
                ++count;
                if (count < REPEAT) {
                    setTimeout(function () {
                        run(count, sum);
                    }, DELAY);
                } else {
                    results.push(sum);
                    if (stepReport.length === 3) {
                        stepReport(current, sum, suites);
                        afterStepReport();
                    } else {
                        stepReport(current, sum, suites, afterStepReport);
                    }
                }
            }

            function run(count, sum) {
                var begin, end;

                function stopwatch() {
                    end = now();
                }

                function doneSuite(e) {
                    if (e) {
                        done(e);
                        return;
                    }
                    if (end === undefined) {
                        stopwatch();
                    }
                    next(sum + end - begin, count);
                }
                doneSuite.stopwatch = stopwatch;

                try {
                    begin = now();
                    suites[current](doneSuite);
                } catch (e) {
                    done(e);
                }
            }

            run(0, 0);
        }

        suite(0);
    };

    benchfn.REPEAT = 100;
    benchfn.DELAY = 0;
    //</YOUR CODE>

    if (_NODE_JS) {
        module.exports = exports;
    } else {
        global.benchfn = exports;
    }
})(this.self || global);
