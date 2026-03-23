import * as vscode from 'vscode';
import { SmartFileLinkProvider } from './linkProvider';

let disposables: vscode.Disposable[] = [];

export function activate(_context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration('smartFileLinks');
    
    if (config.get<boolean>('debug', false)) {
        console.log('Smart File Links extension is now active.');
    }

    registerProviders();

    // Re-register providers when configuration changes
    vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('smartFileLinks.languages') || e.affectsConfiguration('smartFileLinks.enabled')) {
            registerProviders();
        }
    });
}

function registerProviders() {
    // Unregister existing providers
    disposables.forEach(d => d.dispose());
    disposables = [];

    const config = vscode.workspace.getConfiguration('smartFileLinks');
    if (!config.get<boolean>('enabled', true)) {
        return;
    }

    const languages = config.get<string[]>('languages', ['markdown', 'yaml', 'plaintext']);
    const provider = new SmartFileLinkProvider();

    languages.forEach(lang => {
        const disposable = vscode.languages.registerDocumentLinkProvider(
            { language: lang, scheme: 'file' },
            provider
        );
        disposables.push(disposable);
        // Also register for 'untitled' scheme if needed, but spec says file:// links
        // We'll stick to 'file' for now, or just provide the language ID.
    });
}

export function deactivate() {
    disposables.forEach(d => d.dispose());
}
