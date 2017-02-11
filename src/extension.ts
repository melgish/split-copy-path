'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as copyPaste from 'copy-paste';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let disposable =
        vscode.commands.registerCommand('extension.splitCopyPath', (uri) => {
            if (uri) {
                let cfg = vscode.workspace.getConfiguration('splitCopyPath');
                let q = cfg.get('useDoubleQuotes') ? '"' : "'";
                // posix to ensure / regardless of os
                let sliced = path.posix
                    .normalize(vscode.workspace.asRelativePath(uri))
                    .split('/')
                    .map(s => q + s + q);
                if (cfg.get('includeDirname')) {
                    sliced.unshift('__dirname');
                }
                let diced = 'path.join(' + sliced.join(', ') + ')';
                console.log(diced);
                copyPaste.copy(diced);
            }
        });
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}