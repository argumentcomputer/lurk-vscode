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

Be sure to change this to point to your Lurk binary.

## Usage

In a Lurk file, select an s-expression and run the command "Lurk REPL: Send Selected Text".
It will start a Lurk REPL (if there isn't already one running), and execute the expression.
The key binding for this is `alt+right`.

To just open the Lurk REPL, run the command "Lurk REPL: Start".
The key binding for this is `alt+enter`.

The extension does not support multiple REPLs.

## Known Issues

* REPL support is very basic terminal interaction
