'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import * as copyPaste from 'copy-paste';

/**
 * Split supplied URI into quoted parameters
 * @private
 * @param {string} uri file URI
 * @param {boolean} useDoubleQuotes determines quotes to use
 * @return {string[]} uri split into segments and quoted
 */
export function _sliceUri(uri: string, useDoubleQuotes: boolean) : string[]  {
    let filePath = vscode.workspace.asRelativePath(uri);
    let q = useDoubleQuotes ? '"' : "'";

    // posix to ensure / regardless of os
    return path.posix.normalize(filePath).split('/').map(s => q + s + q);
}

/**
 * Create path.join statement from slices
 * @private
 * @param {string[]} slices array of slices to split
 * @param {boolean} includeDirname if true add __dirname to start
 * @return {string} completed join statement.
 */
export function _joinSlices(slices: string[], includeDirname: boolean) {
    if (includeDirname) {
        // change reference to avoid stomping on argument
        slices = ['__dirname'].concat(...slices);
    }

    return 'path.join(' + slices.join(', ') + ')';
}

/**
 * Execute the command
 * @private
 * @param {string} uri URI to parse
 */
export function _splitCopyPath(uri) {
    if (uri) {
        const cfg = vscode.workspace.getConfiguration('splitCopyPath');
        const sliced = _sliceUri(uri, !!cfg.get('useDoubleQuotes'));
        const diced = _joinSlices(sliced, !!cfg.get('includeDirname'));
        copyPaste.copy(diced);
    }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand(
        'extension.splitCopyPath', _splitCopyPath);
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}