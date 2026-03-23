import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('DocumentLinkProvider creates links for valid file:// URIs', async () => {
        const fixturePath = path.resolve(__dirname, '../../../src/test/suite/fixtures/test.md');
        const document = await vscode.workspace.openTextDocument(fixturePath);
        await vscode.window.showTextDocument(document);

        // Wait a bit for links to be computed if needed
        // Actually, provideDocumentLinks is called by VS Code.
        // We can call it directly or use executeCommand.
        
        const links = await vscode.commands.executeCommand<vscode.DocumentLink[]>(
            'vscode.executeLinkProvider',
            document.uri
        );

        assert.ok(links && links.length >= 2, `Expected at least 2 links, found ${links?.length}`);
        
        // Check first link (${workspaceFolder}/src/extension.ts)
        const workspaceLink = links?.find(l => l.target?.fsPath.endsWith('extension.ts'));
        assert.ok(workspaceLink, 'Should have found a link to extension.ts');
        
        // Check second link (${fileDirname}/test.md)
        const fileDirLink = links?.find(l => l.target?.fsPath.endsWith('test.md'));
        assert.ok(fileDirLink, 'Should have found a link to test.md');
    });
});
