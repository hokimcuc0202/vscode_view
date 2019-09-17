import * as path from 'path';
import * as vscode from 'vscode';

export class TemplatePanel {
    public static currentPanel: TemplatePanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionPath: string;
    private readonly _userPath: string;

    public static createOrShow(extensionPath: string, userPath: string) {
        
    const panel = vscode.window.createWebviewPanel(
        'template',
        'template',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file(path.join(extensionPath, 'out','script')),
                vscode.Uri.file(path.join(extensionPath, 'node_modules','@kintone','kintone-ui-component','dist'))
           ]
        }
    )
    
    TemplatePanel.currentPanel = new TemplatePanel(panel, extensionPath, userPath)
    }

    public static revive(panel: vscode.WebviewPanel, extensionPath: string, userPath: string) {
		TemplatePanel.currentPanel = new TemplatePanel(panel, extensionPath, userPath)
	}

    private constructor(panel: vscode.WebviewPanel, extensionPath: string, userPath: string) {
		this._panel = panel;
        this._extensionPath = extensionPath;
        this._userPath = userPath

		// Set the webview's initial html content
        this._panel.webview.html = this._getHtmlForWebview();
        
        this._panel.onDidChangeViewState(
			e => {
				if (this._panel.visible) {
                    // this._update();
				}
			},
			null,
			// this._disposables
		);

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'createTemplate':
                        const terminal = vscode.window.createTerminal({
                        	name: `Create template`,
                        	cwd: userPath
                        });
                        terminal.sendText(message.text);
                        terminal.show();
						return;
				}
			},
			null,
			// this._disposables
		);
    }
    
    private _getHtmlForWebview() {
        
        const scriptPathOnDisk = vscode.Uri.file(
            path.join(this._extensionPath, 'out', 'script', 'template.min.js')
        );
        
        // And the uri we use to load this script in the webview
        const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
        const nonce = this.getNonce();

        return `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="Content-Security-Policy" content="default-src 'none' 'unsafe-inline'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Create template</title>
                </head>
                <body>
                    <div id="container"></div>
                    <h3 id="lines-of-code-counter">0</h3>
                    <script nonce="${nonce}" src="${scriptUri}"></script>
                </body>
            </html>`;
    }
    getNonce() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}


