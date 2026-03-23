import * as path from 'path';

export interface ResolverContext {
    documentUri: { fsPath: string; path: string };
    workspaceFolders?: { uri: { fsPath: string; path: string }; name: string }[];
    env: Record<string, string | undefined>;
}

export function expandVariables(text: string, context: ResolverContext): string {
    const { documentUri, workspaceFolders, env } = context;

    // Find the workspace folder containing the document
    const currentWorkspaceFolder = workspaceFolders?.find(folder => {
        return documentUri.fsPath.startsWith(folder.uri.fsPath);
    });

    return text.replace(/\$\{([^}]+)\}/g, (match, varName) => {
        let result: string | undefined;
        if (varName === 'workspaceFolder') {
            result = currentWorkspaceFolder?.uri.fsPath;
        } else if (varName === 'workspaceFolderBasename') {
            result = currentWorkspaceFolder?.name;
        } else if (varName === 'file') {
            result = documentUri.fsPath;
        } else if (varName === 'fileDirname') {
            result = path.dirname(documentUri.fsPath);
        } else if (varName === 'relativeFile') {
            if (currentWorkspaceFolder) {
                result = path.relative(currentWorkspaceFolder.uri.fsPath, documentUri.fsPath);
            }
        } else if (varName.startsWith('env:')) {
            const envVarName = varName.substring(4);
            result = env[envVarName];
        }

        if (result !== undefined) {
            // Normalize backslashes to forward slashes for URI compatibility
            return result.replace(/\\/g, '/');
        }
        return match;
    });
}
