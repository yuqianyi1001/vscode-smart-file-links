import * as vscode from 'vscode';
import { FILE_URI_PATTERN } from './patterns';
import { expandVariables, ResolverContext } from './resolver';

export class SmartFileLinkProvider implements vscode.DocumentLinkProvider {
    public async provideDocumentLinks(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken
    ): Promise<vscode.DocumentLink[]> {
        const links: vscode.DocumentLink[] = [];
        const config = vscode.workspace.getConfiguration('smartFileLinks');
        
        if (!config.get<boolean>('enabled', true)) {
            return [];
        }

        const text = document.getText();
        const context: ResolverContext = {
            documentUri: document.uri,
            workspaceFolders: vscode.workspace.workspaceFolders?.map(folder => ({
                uri: folder.uri,
                name: folder.name
            })),
            env: process.env as Record<string, string | undefined>
        };

        let match;
        // Using a loop to find all matches in the document
        // Since regex has 'g' flag, exec() will iterate
        FILE_URI_PATTERN.lastIndex = 0; // Reset just in case
        while ((match = FILE_URI_PATTERN.exec(text)) !== null) {
            const range = new vscode.Range(
                document.positionAt(match.index),
                document.positionAt(match.index + match[0].length)
            );

            const expandedText = expandVariables(match[0], context);
            
            // If there are still placeholders left, it means some were unresolved
            if (/\$\{[^}]+\}/.test(expandedText)) {
                continue;
            }
            
            try {
                const uri = vscode.Uri.parse(expandedText);
                if (uri.scheme === 'file') {
                    // Check if file exists
                    try {
                        await vscode.workspace.fs.stat(uri);
                        links.push(new vscode.DocumentLink(range, uri));
                    } catch {
                        // File doesn't exist, don't create link
                    }
                }
            } catch (e) {
                if (config.get<boolean>('debug', false)) {
                    console.error(`Error parsing URI: ${expandedText}`, e);
                }
            }
        }

        return links;
    }
}
