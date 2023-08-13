// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const lurkTerminalName = 'Lurk REPL';

let lurkTerminal: vscode.Terminal | null = null;
let textQueue: string[];
let onLoop = false;

function queueLoop() {
    if (lurkTerminal !== null) {
        const text = textQueue.shift();
        if (text) {
            lurkTerminal.sendText(text);
        }
        if (textQueue.length > 0) {
            // keep popping messages
            onLoop = true;
            setTimeout(queueLoop, 10);
        } else {
            onLoop = false;
        }
    } else {
        onLoop = true;
        setTimeout(queueLoop, 100);
    }
}

function triggerLoop() {
    if (onLoop) {
        return;
    }
    queueLoop();
}

async function createLurkTerminal() {
    // create lurk terminal if it doesn't exist
    if (lurkTerminal === null || lurkTerminal.exitStatus !== undefined) {
        const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('lurkREPL');
        const lurkCommand = config.get("lurkRunCommand", "/home/user/.cargo/bin/lurk");
        
        textQueue = [];

        const terminalOptions = {
            name: lurkTerminalName,
            hideFromUser: true,
            shellPath: lurkCommand
        };

        lurkTerminal = vscode.window.createTerminal(terminalOptions);
        lurkTerminal.show(true);
    } 
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    function activateLurk () {
        createLurkTerminal();
        vscode.window.showInformationMessage("Lurk REPL activated");
    };

    async function sendSelected () {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            await createLurkTerminal();
            let text = editor.document.getText(editor.selection);
            console.log("Sending to lurk REPL: %s", text);
            textQueue.push(text);
            triggerLoop();
        }
    };

    context.subscriptions.push(vscode.commands.registerCommand('lurkREPL.activate', activateLurk));
    context.subscriptions.push(vscode.commands.registerCommand('lurkREPL.sendSelected', sendSelected));
 }

// This method is called when your extension is deactivated
export function deactivate() {}
