# Lurk VSCode extension

This extension adds some basic support for lurk in VS Code. 

## Features

At this point, there is code highlighting, and the ability to run a
lurk repl and send code blocks from a source file to the repl for
evaluation.

## Installing 

Run 

    sudo npm install -g vsce
    npm install
    vsce package   # answer yes to prompts
	code --install-extension lurk-0.0.1.vsix
	
## Extension Settings

This extension contributes the following settings:

* `lurkREPL.lurkRunCommand`: The location of the lurk binary (for REPL support)

Be sure to change this to point to wherever your lurk binary is.

## Using

In a lurk file, select an s-expression and run the command "Lurk REPL:
Send Selected Text". It will start a lurk repl (if there isn't already
one running), and execute the expression.

If you prefer to just use the REPL directly inside VSCode just like
you would in a terminal, you can run the command "Lurk REPL:
Activate/Initialize" to start a REPL.

The extension does not support multiple REPLs.

## Known Issues

* REPL support is very basic terminal interaction

