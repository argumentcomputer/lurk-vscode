// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const lurkTerminalName = 'Lurk REPL';

let lurkTerminal: vscode.Terminal | null = null;

function getTerminal(): vscode.Terminal {
    // create lurk terminal if it doesn't exist
    if (lurkTerminal === null || lurkTerminal.exitStatus !== undefined) {
        const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('lurkREPL');
        const lurkCommand = config.get("lurkRunCommand", "/home/user/.cargo/bin/lurk");

        const terminalOptions = {
            name: lurkTerminalName,
            hideFromUser: true,
            shellPath: lurkCommand
        };

        lurkTerminal = vscode.window.createTerminal(terminalOptions);
        lurkTerminal.show(true);
    }
    return lurkTerminal;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    function start () {
        getTerminal();
    };

    function sendSelected () {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            let text = editor.document.getText(editor.selection);
            let terminal = getTerminal();
            terminal.sendText(text);
        }
    };

    context.subscriptions.push(vscode.commands.registerCommand('lurkREPL.start', start));
    context.subscriptions.push(vscode.commands.registerCommand('lurkREPL.sendSelected', sendSelected));
 }

// This method is called when your extension is deactivated
export function deactivate() {}
