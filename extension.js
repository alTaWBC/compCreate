// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "compCreate" is now active!');


    let disposable = vscode.commands.registerCommand("compCreate.createComponent", async (folder) => {
        // use this if triggered by a menu item,
        let folderLocation = folder; // folder will be undefined when triggered by keybinding

        if (!folder) {
            // so triggered by a keybinding
            await vscode.commands.executeCommand("copyFilePath");
            folder = await vscode.env.clipboard.readText(); // returns a string

            // see note below for parsing multiple files/folders
            folderLocation = vscode.Uri.file(folder).fsPath; // make it a Uri
        }
        const filename = (await vscode.window.showInputBox()).toString();

        const wsedit = new vscode.WorkspaceEdit();
        const javascriptFile = vscode.Uri.file(folderLocation + `/${filename}.js`);
        const cssFile = vscode.Uri.file(folderLocation + `/${filename}.module.css`);

        wsedit.createFile(javascriptFile, { ignoreIfExists: true });
        wsedit.createFile(cssFile, { ignoreIfExists: true });

        let javascript_content = `import React from 'react';
import styles from './${filename}.module.css'

const ${filename} = (props) => (
	<div className={styles.${filename[0].toUpperCase()}${filename.substring(1)}}></div>
);

export default ${filename};		
`;
        let css_content = `.${filename[0].toUpperCase()}${filename.substring(1)}{

}
		`;

        fs.writeFileSync(javascriptFile.fsPath, javascript_content, "utf8");
        fs.writeFileSync(cssFile.fsPath, css_content, "utf8");

        vscode.workspace.applyEdit(wsedit);
    });
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
