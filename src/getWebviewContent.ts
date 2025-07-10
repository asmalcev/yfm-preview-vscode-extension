import * as vscode from 'vscode';

export function getWebviewContent(
    context: vscode.ExtensionContext,
    panel: vscode.WebviewPanel,
    html: string
): string {
    const cssUri = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, 'media', 'yfm.css')
    );
    const jsUri = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, 'media', 'yfm.js')
    );

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <link rel="stylesheet" href="${cssUri}" />
    </head>
    <body>
      ${html}
      <script src="${jsUri}"></script>
    </body>
    </html>
  `;
}

//   <style>body { font-family: sans-serif; padding: 2em; }</style>
