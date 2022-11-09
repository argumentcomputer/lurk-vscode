// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const lurkTerminalName = 'Lurk REPL';
const isString = (obj: any) => typeof obj === 'string';
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

let lurkTerminal: any = null;
let textQueue: string[];
let waitsQueue: number[];
let currentFilename: string = "";
let isrunning: boolean = false;

function queueLoop() {
    const config = vscode.workspace.getConfiguration("lurkREPL");
    const directSend = config.get('sendTextDirectly');
    if (textQueue.length > 0 && lurkTerminal !== null) {
        isrunning = true;
        const text = textQueue.shift();
        const waitTime = waitsQueue.shift();
        lurkTerminal.sendText(text);
        setTimeout(queueLoop, waitTime!);
    } else {
        if (isrunning) {            
            if (textQueue.length === 0 && lurkTerminal !== null) {
                isrunning = false;
            };
        } else {
            if (!directSend){
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
    if (lurkTerminal === null) {
        const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('lurkREPL');
        const lurkCommand = config.get("lurkRunCommand", "/home/user/workspace/lurk-rs/target/release/lurkrs");
        const terminalCommand = config.get("customTerminalCommand", "");
        const envCommand = config.get("environmentActivationCommand", "");

        textQueue = [];
        waitsQueue = [];

        const terminalOptions = {
            name: lurkTerminalName,
            hideFromUser: true
        };

        lurkTerminal = vscode.window.createTerminal(terminalOptions);
        lurkTerminal.show(true);  //defalt: true

        if (terminalCommand && isString(terminalCommand)){
            lurkTerminal.sendText(terminalCommand);
        }
        if (envCommand && isString(envCommand)){
            lurkTerminal.sendText(envCommand);
        }
        await delay(config.get("terminalInitTimeout", 1000));

        lurkTerminal.sendText(lurkCommand);
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

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "jeff" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	/* let disposable = vscode.commands.registerCommand('jeff.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from jeff!');
	}); */

	//context.subscriptions.push(disposable);

    function sendLines(startLine: number, endLine: number, checkCwd=false) {
        const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('lurkREPL');
        const directSend = config.get('sendTextDirectly');
        const editor = vscode.window.activeTextEditor;

        if (editor){
            const filename = editor.document.fileName;
            let command;

            if (directSend) {
                let docText = editor.document.getText();
                let startRange = editor.document.offsetAt(editor.document.lineAt(startLine).range.start);
                let endRange = editor.document.offsetAt(editor.document.lineAt(endLine).range.end);
                function removeLeadingIndent(command: string) {
                    const strings = command.split('\n');
                    const filterStrings = strings.filter(item => item.search(/\S/) > -1);
                    const indents = filterStrings.map(item => item.search(/\S/));
                    const minIndent = Math.min(...indents);

                    if (minIndent > 0){
                        return filterStrings.map(item => item.slice(minIndent)).join('\n');
                    }
                    else {
                        return command;
                    }
                }
                command = removeLeadingIndent(docText.substring(startRange, endRange));
            } else {
                command = `\n%load -r ${startLine + 1}-${endLine + 1} ${filename}\n`;
            }

            if (config.get("copyToClipboard", false)) {
                vscode.env.clipboard.writeText(command).then((v)=>v, (v)=>null);
            }

            sendQueuedText(command, 100);
            queueLoop();
        }
    };

    async function sendSelected () {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('lurkREPL');
            const globalConfig: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration();

            const selectStart = editor.document.offsetAt(editor.selection.start);
            const selectEnd = editor.document.offsetAt(editor.selection.end);
            const sL = editor.document.positionAt(selectStart).line;
            const eL = editor.document.positionAt(selectEnd).line;

            if (config.get('removeSelectionAfterSend', true)) {
                if (globalConfig.hasOwnProperty('vim')) {
                    vscode.commands.executeCommand('extension.vim_ctrl+[');
                }
                else {
                    vscode.commands.executeCommand('editor.action.cancelSelectionAnchor');
                }
            }

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

