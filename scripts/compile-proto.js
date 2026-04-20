const { execSync } = require('child_process');
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

try {
  // Compile .proto to .js using protobufjs CLI
  execSync(
    `npx pbjs --target static-module --wrap commonjs --out ${jsOut} ${protoFile}`,
    { stdio: 'inherit', shell: true }
  );
  console.log('✓ Generated', jsOut);

  // Generate TypeScript definitions
  execSync(`npx pbts --out ${tsOut} ${jsOut}`, { stdio: 'inherit', shell: true });
  console.log('✓ Generated', tsOut);
  console.log('Protocol Buffers compilation complete!');
} catch (error) {
  console.error('Error compiling Protocol Buffers:', error.message);
  process.exit(1);
}

