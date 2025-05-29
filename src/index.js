const core = require('@actions/core');
const github = require('@actions/github');
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');

async function run() {
  try {
    // Get inputs
    const docPattern = core.getInput('doc-path') || 'docs/**/*.md';
    const codePath = core.getInput('code-path') || 'src';
    const failOnError = core.getInput('fail-on-error') === 'true';

    core.info(`Scanning documentation files with pattern: ${docPattern}`);
    const docFiles = glob.sync(docPattern);
    if (docFiles.length === 0) {
      core.warning('No documentation files found!');
      return;
    }

    // Load all source code files (js, ts, py etc.) for reference checks
    // For simplicity, scan all .js and .ts files here
    const codeFiles = glob.sync(`${codePath}/**/*.{js,ts,py,java,go,rb}`);
    if (codeFiles.length === 0) {
      core.warning('No source code files found to check references against.');
      return;
    }

    // Read codebase content for quick lookup
    let codeContent = '';
    for (const file of codeFiles) {
      codeContent += fs.readFileSync(file, 'utf8') + '\n';
    }

    const md = new MarkdownIt();
    let brokenReferences = [];

    // For each doc file, extract code references inside backticks or links
    for (const docFile of docFiles) {
      const content = fs.readFileSync(docFile, 'utf8');
      const tokens = md.parse(content, {});
      
      tokens.forEach(token => {
        if (token.type === 'inline' && token.children) {
          token.children.forEach(child => {
            // Check inline code spans `likeThis()`
            if (child.type === 'code_inline') {
              const ref = child.content;
              if (!codeContent.includes(ref)) {
                brokenReferences.push({
                  file: docFile,
                  reference: ref,
                });
              }
            }
            // Could extend for links or code blocks here
          });
        }
      });
    }

    if (brokenReferences.length > 0) {
      core.error(`Found ${brokenReferences.length} broken references:`);
      brokenReferences.forEach(ref => {
        core.error(`- ${ref.reference} in ${ref.file}`);
      });

      if (failOnError) {
        core.setFailed('Broken references detected in documentation!');
      }
    } else {
      core.info('No broken documentation references found.');
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
