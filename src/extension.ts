import * as vscode from 'vscode';

import transform from '@diplodoc/transform';

import { getWebviewContent } from './getWebviewContent';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        'yfm-preview-vscode-extension.startPreview',
        () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor!');
                return;
            }
            const doc = editor.document;
            if (doc.languageId !== 'markdown') {
                vscode.window.showErrorMessage('Not a Markdown file!');
                return;
            }
            const panel = vscode.window.createWebviewPanel(
                'markdownPreview',
                'Markdown Preview',
                vscode.ViewColumn.Beside,
                { enableScripts: true }
            );

            const {
                result: { html, meta, title, headings },
                logs,
            } = transform(doc.getText(), {});

            panel.webview.html = getWebviewContent(context, panel, html);
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}
