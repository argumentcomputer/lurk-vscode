// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const lurkTerminalName = 'Lurk REPL';
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

let lurkTerminal: vscode.Terminal | null = null;
let textQueue: string[];
let waitsQueue: number[];
let isrunning: boolean = false;

function queueLoop() {
    const config = vscode.workspace.getConfiguration("lurkREPL");
    const directSend = config.get('sendTextDirectly');
    if (textQueue.length > 0 && lurkTerminal !== null) {
        isrunning = true;
        const text = textQueue.shift();
        const waitTime = waitsQueue.shift();
        if (text) {
	    lurkTerminal.sendText(text);
            setTimeout(queueLoop, waitTime!);
	}
    } else {
        if (isrunning) {            
            if (textQueue.length === 0 && lurkTerminal !== null) {
                isrunning = false;
            };
        } else {
            if (!directSend && lurkTerminal !== null){
                lurkTerminal.sendText('\n', false);
            }
            return;
        };
        setTimeout(queueLoop, 100);
    }
}

function sendQueuedText(text: string, waitTime = 10) {
    textQueue.push(text);
    waitsQueue.push(waitTime);
}

async function createLurkTerminal() {
    // create lurk terminal if it doesn't exist
    if (lurkTerminal === null || lurkTerminal.exitStatus !== undefined) {
        const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('lurkREPL');
        const lurkCommand = config.get("lurkRunCommand", "/home/user/.cargo/bin/lurk");
        
        textQueue = [];
        waitsQueue = [];

        const terminalOptions = {
            name: lurkTerminalName,
            hideFromUser: true,
            shellPath: lurkCommand
        };

        lurkTerminal = vscode.window.createTerminal(terminalOptions);
        lurkTerminal.show(true);  //defalt: true

        await delay(config.get("lurkCommandTimeout", 300));
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
            //let r = new vscode.Range(editor.selection.start, editor.selection.end)
            let expr = editor.document.getText(editor.selection);
            console.log("Sending to lurk REPL: %s", expr);
            sendQueuedText(expr);
            queueLoop();
        }
    };

    context.subscriptions.push(vscode.commands.registerCommand('lurkREPL.activate', activateLurk));
    context.subscriptions.push(vscode.commands.registerCommand('lurkREPL.sendSelected', sendSelected));
 }

// This method is called when your extension is deactivated
export function deactivate() {}
