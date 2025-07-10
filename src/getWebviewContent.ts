import * as vscode from 'vscode';

export function getWebviewContent(
    context: vscode.ExtensionContext,
    panel: vscode.WebviewPanel,
    html: string
): string {
    const cssUri = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, 'dist', 'yfm.css')
    );
    const jsUri = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, 'dist', 'yfm.js')
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
          background-color: #fafafa;
        }
      </style>
      <link rel="stylesheet" href="${cssUri}" />
    </head>
    <body>
        <div class="yfm">
            ${html}
        </div>
        <script src="${jsUri}"></script>
    </body>
    </html>
  `;
}
