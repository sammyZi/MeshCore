const pbjs = require('protobufjs/cli/pbjs');
const pbts = require('protobufjs/cli/pbts');
const path = require('path');
const fs = require('fs');

const protoDir = path.join(__dirname, '..', 'proto');
const outDir = path.join(__dirname, '..', 'src', 'generated');

// Ensure output directory exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const protoFile = path.join(protoDir, 'mesh.proto');
const jsOut = path.join(outDir, 'mesh.js');
const tsOut = path.join(outDir, 'mesh.d.ts');

console.log('Compiling Protocol Buffers...');

// Compile .proto to .js
pbjs.main(
  [
    '--target',
    'static-module',
    '--wrap',
    'commonjs',
    '--out',
    jsOut,
    protoFile,
  ],
  (err, output) => {
    if (err) {
      console.error('Error compiling proto to JS:', err);
      process.exit(1);
    }
    console.log('✓ Generated', jsOut);

    // Generate TypeScript definitions
    pbts.main(['--out', tsOut, jsOut], (err, output) => {
      if (err) {
        console.error('Error generating TypeScript definitions:', err);
        process.exit(1);
      }
      console.log('✓ Generated', tsOut);
      console.log('Protocol Buffers compilation complete!');
    });
  }
);
