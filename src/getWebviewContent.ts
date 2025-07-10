import * as vscode from 'vscode';
import { Config } from './types';

export function getWebviewContent(
    context: vscode.ExtensionContext,
    panel: vscode.WebviewPanel,
    html: string,
    theme: Config['theme']
): string {
    const cssUri = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, 'dist', 'yfm.css')
    );
    const jsUri = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, 'dist', 'yfm.js')
    );
    const darkCssUri = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, 'dist', 'extension.css')
    );

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          margin: 0;
          padding: 2rem;
          background-color: ${theme === 'light' ? '#fafafa' : '#333'};
        }
      </style>
      <link rel="stylesheet" href="${cssUri}" />
      <link rel="stylesheet" href="${darkCssUri}" />
    </head>
    <body>
        <div class="yfm ${theme === 'dark' ? 'dark' : ''}">
            ${html}
        </div>
        <script src="${jsUri}"></script>
    </body>
    </html>
  `;
}
