import * as assert from 'assert';
import { expandVariables, ResolverContext } from '../../resolver';

suite('Resolver Test Suite', () => {
    const context: ResolverContext = {
        documentUri: { fsPath: '/Users/j.wu/ws/SmartFileLinks/docs/notes.md', path: '/Users/j.wu/ws/SmartFileLinks/docs/notes.md' },
        workspaceFolders: [
            {
                uri: { fsPath: '/Users/j.wu/ws/SmartFileLinks', path: '/Users/j.wu/ws/SmartFileLinks' },
                name: 'SmartFileLinks'
            }
        ],
        env: {
            HOME: '/Users/j.wu',
            MY_VAR: 'hello'
        }
    };

    test('expand ${workspaceFolder}', () => {
        const text = 'file:///${workspaceFolder}/sources/cbeta/T17n0779_001.xml';
        const result = expandVariables(text, context);
        assert.strictEqual(result, 'file:////Users/j.wu/ws/SmartFileLinks/sources/cbeta/T17n0779_001.xml');
    });

    test('expand ${workspaceFolderBasename}', () => {
        const text = 'file:///opt/${workspaceFolderBasename}/notes.txt';
        const result = expandVariables(text, context);
        assert.strictEqual(result, 'file:///opt/SmartFileLinks/notes.txt');
    });

    test('expand ${file}', () => {
        const text = 'file:///${file}';
        const result = expandVariables(text, context);
        assert.strictEqual(result, 'file:////Users/j.wu/ws/SmartFileLinks/docs/notes.md');
    });

    test('expand ${fileDirname}', () => {
        const text = 'file:///${fileDirname}/other.md';
        const result = expandVariables(text, context);
        assert.strictEqual(result, 'file:////Users/j.wu/ws/SmartFileLinks/docs/other.md');
    });

    test('expand ${relativeFile}', () => {
        const text = 'file:///${relativeFile}';
        const result = expandVariables(text, context);
        assert.strictEqual(result, 'file:///docs/notes.md');
    });

    test('expand ${env:HOME}', () => {
        const text = 'file:///${env:HOME}/Downloads/book.xml';
        const result = expandVariables(text, context);
        assert.strictEqual(result, 'file:////Users/j.wu/Downloads/book.xml');
    });

    test('expand ${env:MY_VAR}', () => {
        const text = 'file:///${env:MY_VAR}/world';
        const result = expandVariables(text, context);
        assert.strictEqual(result, 'file:///hello/world');
    });

    test('unresolved env variable stays as is', () => {
        const text = 'file:///${env:UNKNOWN}/world';
        const result = expandVariables(text, context);
        assert.strictEqual(result, 'file:///${env:UNKNOWN}/world');
    });

    test('unknown placeholder stays as is', () => {
        const text = 'file:///${unknown}/world';
        const result = expandVariables(text, context);
        assert.strictEqual(result, 'file:///${unknown}/world');
    });

    // We can't easily test resolveUri with platform specific paths here,
    // but we can test basic decoding.
    // Actually, resolveUri was simplified to just return a path.
    // In linkProvider we use vscode.Uri.parse(expandedText) which is better.
});
