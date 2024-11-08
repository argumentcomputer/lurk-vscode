// Import the 'vscode' module to use the VS Code extensibility API
import * as vscode from 'vscode';

// Define a unique name for the Lurk REPL terminal
const lurkTerminalName = 'Lurk REPL';

// Store a reference to the Lurk REPL terminal (if it has been created)
let lurkTerminal: vscode.Terminal | null = null;

/**
 * Gets or creates the Lurk REPL terminal instance.
 *
 * If the terminal doesn't exist, or if it was closed (determined by checking
 * the `exitStatus` property), this function creates a new terminal with settings
 * based on the 'lurkREPL' configuration.
 *
 * @returns {vscode.Terminal} The active or newly created Lurk REPL terminal instance.
 */
function getTerminal(): vscode.Terminal {
    // Create the Lurk terminal if it doesn't already exist or if it was closed.
    if (lurkTerminal === null || lurkTerminal.exitStatus !== undefined) {
        const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('lurkREPL');
        const lurkCommand = config.get("lurkRunCommand", "${userHome}/.cargo/bin/lurk");

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

/**
 * When the extension is activated, it registers two commands:
 *   - `lurkREPL.start`: Initializes the Lurk REPL terminal.
 *   - `lurkREPL.sendSelected`: Sends the currently selected text in the editor
 *     to the Lurk REPL terminal for evaluation.
 *
 * @param {vscode.ExtensionContext} context - The extension context for managing resources
 *   and subscriptions.
 */
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
