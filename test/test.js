var benchfn = require('../');
var assert = require('assert');

describe('example', function () {
    it('', function (done) {
        var expected = [200, 0];
        var count = 0;

        benchfn(
            [
                function functionNameIsTestName(done) {
                    //process.nextTick(done);
                    setTimeout(done, 2);
                },
                function syncTestIsLikeThis(done) {
                    done();
                }
            ],
            // this function is called when 'done' was called in every function in above list
            function step(cur, totalMillisecond, tests) {
                ++count;
                assert(totalMillisecond >= expected[cur]);

                // 'cur' is 0 based index of function in above list
                // 'tests' is 1st argument of benchfn(above list)
                console.log('step:' + tests[cur].name + ':' + totalMillisecond);
            },
            function complete(err) {
                assert(!err);
                assert(count === 2);
                console.log('complete');
                done();
            }
        );
        // you can configure like bnechfn.TEST = 200 to change repeat count.
    });

    it('async step', function (done) {
        var b = +(new Date());
        benchfn(
            [
                function nothing(done) {
                    done();
                }
            ],
            function step(cur, totalMillisecond, tests, done) {
                setTimeout(done, 1);
            },
            function complete(err) {
                assert(+(new Date()) - b >= 1);
                done();
            }
        );
    });

    it('stopwatch', function (done) {
        var b = +(new Date());
        benchfn(
            [
                function benchSyncButWaitAsyncBeforeDone(done) {
                    setTimeout(function () {
                        done();
                    }, 1);
                    done.stopwatch();
                }
            ],
            function step(cur, totalMillisecond, tests) {
                // totalMillisecond should be much smaller than benchfn.REPEAT
                assert(totalMillisecond < benchfn.REPEAT);
            },
            function complete(err) {
                var duration = +(new Date()) - b;
                assert(duration >= benchfn.REPEAT);
                done();
            }
        );
    });
});
