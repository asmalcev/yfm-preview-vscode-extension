import * as vscode from 'vscode';

import transform from '@diplodoc/transform';

import { getWebviewContent } from './getWebviewContent';
import { debounce } from './debounce';

import './yfm.dark.css';
import { Config } from './types';

const EXTENSION = 'yfm-preview-vscode-extension';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        `${EXTENSION}.startPreview`,
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

            let config: Config = {
                theme: 'light',
                liveReload: true,
                liveReloadDelay: 2000,
            };

            function updateConfig() {
                const vscodeConfig =
                    vscode.workspace.getConfiguration(EXTENSION);
                const theme =
                    vscodeConfig.get<'light' | 'dark'>('theme') ?? 'light';
                const liveReload =
                    vscodeConfig.get<boolean>('liveReload') ?? true;
                const liveReloadDelay =
                    vscodeConfig.get<number>('liveReloadDelay') ?? 2000;

                config = {
                    theme,
                    liveReload,
                    liveReloadDelay,
                };
            }

            function updateWebview() {
                const {
                    result: { html },
                } = transform(doc.getText(), {});

                panel.webview.html = getWebviewContent(
                    context,
                    panel,
                    html,
                    config.theme
                );
            }

            let changeDocDisposable: vscode.Disposable;
            function updateLiveReload() {
                changeDocDisposable?.dispose();

                if (config.liveReload) {
                    const debouncedUpdateWebview = debounce(
                        updateWebview,
                        config.liveReloadDelay
                    );

                    changeDocDisposable =
                        vscode.workspace.onDidChangeTextDocument((e) => {
                            if (
                                e.document.uri.toString() === doc.uri.toString()
                            ) {
                                debouncedUpdateWebview();
                            }
                        });
                }
            }

            updateConfig();
            updateWebview();
            updateLiveReload();

            vscode.workspace.onDidChangeConfiguration((event) => {
                if (event.affectsConfiguration(EXTENSION)) {
                    updateConfig();
                    updateWebview();
                    updateLiveReload();
                }
            });

            panel.onDidDispose(() => {
                changeDocDisposable?.dispose();
            });
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}
