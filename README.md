# Lurk VSCode extension

This extension adds some basic support for lurk in VS Code. 

## Features

At this point, there is code highlighting, and the ability to run a
lurk repl and send code blocks from a source file to the repl for
evaluation.

## Installing 

Run 

    sudo npm install --global vsce
    vsce package
	code --install-extension lurk-0.0.1.vsix
	
## Extension Settings

This extension contributes the following settings:

* `lurkREPL.lurkRunCommand`: The location of the lurk binary (for REPL support)

## Known Issues

* REPL support is very basic terminal interaction

