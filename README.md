# Smart File Links

A VS Code extension to make variable-based `file://` links in text documents clickable.

## Features

- Detects `file://` URIs containing placeholders and turns them into clickable document links.
- Supports the following variables:
  - `${workspaceFolder}`: The absolute path of the workspace folder containing the document.
  - `${workspaceFolderBasename}`: The name of the workspace folder containing the document.
  - `${file}`: The absolute path of the current document.
  - `${fileDirname}`: The absolute directory of the current document.
  - `${relativeFile}`: The current document path relative to its containing workspace folder.
  - `${env:NAME}`: Environment variables (e.g., `${env:HOME}`).
- Supported languages: `markdown`, `yaml`, `plaintext`.
- Links are only created if the resolved file actually exists on disk.

## Extension Settings

- `smartFileLinks.enabled`: Enable/disable this extension.
- `smartFileLinks.languages`: Array of language IDs for which the extension is active (default: `["markdown", "yaml", "plaintext"]`).
- `smartFileLinks.debug`: Enable debug logging.

## Usage

Simply use `file://` URIs with placeholders in your documents:

```yaml
cbeta_source: file:///${workspaceFolder}/sources/cbeta/T17n0779_001.xml
notes: file:///${fileDirname}/notes.txt
home_file: file:///${env:HOME}/Downloads/book.xml
```

`Cmd/Ctrl+Click` on the link to open the file.
