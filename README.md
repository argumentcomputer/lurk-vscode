# Lurk VSCode extension

This extension adds some basic support for Lurk in VS Code. 

## Features

* Start a Lurk REPL
* Send code to be run in the Lurk REPL

## Installing 

Run

```text
$ sudo npm install -g vsce
$ npm install
$ vsce package
$ code --install-extension lurk-0.0.1.vsix
```
	
## Extension Settings

This extension contributes the following settings:

* `lurkREPL.lurkRunCommand`: The location of the Lurk binary (for REPL support)

Be sure to change this to point to wherever your Lurk binary is.

## Using

In a lurk file, select an s-expression and run the command "Lurk REPL:
Send Selected Text". It will start a lurk repl (if there isn't already
one running), and execute the expression. The key binding for this is
`alt+right`.

If you prefer to just use the REPL directly inside VSCode just like
you would in a terminal, you can run the command "Lurk REPL:
Activate/Initialize" to start a REPL.

The extension does not support multiple REPLs.

## Known Issues

* REPL support is very basic terminal interaction
