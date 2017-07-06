//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../src/extension';

// Defines a Mocha test suite to group tests of similar kind together
suite('Split / Copy Path', () => {
    suite('_sliceUri', () => {
        const testUri = 'a/b/c';
        test('It should split Uri values into an array', () => {
            const slices = myExtension._sliceUri(testUri, false);
            assert.equal(3, slices.length);
        });

        test('It should use double quotes when useDoubleQuotes is true', () => {
            const slices = myExtension._sliceUri(testUri, true);
            assert.equal('"a"', slices[0]);
        });

        test('It should use single quotes when useDoubleQuotes is false', () => {
            const slices = myExtension._sliceUri(testUri, false);
            assert.equal("'c'", slices[2]);
        });
    });

    suite('_joinSlices', () => {
        const testArray = ['"a"', '"b"', '"c"'];
        test('It should join array into string', () => {
            const join = myExtension._joinSlices(testArray, false);
            assert.equal(typeof join, 'string');
        });

        test('It should add __dirname if includeDirname is true', () => {
            const join = myExtension._joinSlices(testArray, true);
            assert.ok(/dirname/.test(join));
        });

        test('It should not add __dirname if includeDirname is false', () => {
            const join = myExtension._joinSlices(testArray, false);
            assert.ok(!/dirname/.test(join));
        });

        test('It should not change supplied array parameter', () => {
            const copy = testArray.slice();
            const join = myExtension._joinSlices(testArray, true);
            assert.deepEqual(copy, testArray);
        });
    });
});