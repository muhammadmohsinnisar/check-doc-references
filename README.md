# check-doc-references

[![Release](https://img.shields.io/github/v/release/muhammadmohsinnisar/check-doc-references?style=flat-square)](https://github.com/muhammadmohsinnisar/check-doc-references/releases)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A GitHub Action to **check that all inline code references in your documentation actually exist in your source code**, helping prevent broken or outdated code references in your docs.

---

## Features

- Scans Markdown files for inline code references (e.g., `functionName`)
- Verifies if these references exist in your source code files
- Reports broken references as errors or warnings
- Supports customizable paths for documentation and source code
- Optional fail-on-error mode to block merges with broken references

---

## Usage

Add the action to your GitHub workflow to automatically validate code references in docs on every push or pull request.

### Example workflow

```yaml
name: Check Documentation References

on: [push, pull_request]

jobs:
  check-doc-references:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check code references in docs
        uses: muhammadmohsinnisar/check-doc-references@v1.0.0
        with:
          doc-path: 'docs/**/*.md'       # Glob pattern to locate your Markdown docs
          code-path: 'src'               # Directory containing your source code files
          fail-on-error: true            # Fail workflow if broken references found (default: false)
```

## Inputs

| Input          | Required | Default | Description                                        |
|----------------|----------|---------|--------------------------------------------------|
| `doc-path`     | yes      | —       | Glob pattern to locate documentation files (Markdown) |
| `code-path`    | yes      | —       | Directory containing source code files            |
| `fail-on-error`| no       | false   | If true, workflow fails on broken references      |

---

## Output

- The action logs a summary of scanned files and broken references.
- If `fail-on-error` is true and broken references exist, the workflow fails.

---

## How it works

1. Parses the specified Markdown docs.
2. Extracts all inline code spans (e.g., text enclosed in backticks: `` `code` ``).
3. Searches the source code files for matching definitions or mentions.
4. Reports references found nowhere in the source code as broken.

---

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to open a pull request or issue.
