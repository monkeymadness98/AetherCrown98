const https = require('https');

console.log('🔧 AI Business Deployment Debugger');
console.log('==================================\n');

// Check environment variables
const requiredEnvVars = [
  'NODE_ENV',
  'OPENAI_API_KEY',
  'DATABASE_URL'
];

console.log('📋 Environment Variables Check:');
requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar}: Set`);
  } else {
    console.log(`❌ ${envVar}: Missing`);
  }
});

// Check Node.js version
console.log(`\n📦 Runtime Information:`);
console.log(`Node.js Version: ${process.version}`);
console.log(`Platform: ${process.platform}`);
console.log(`Architecture: ${process.arch}`);

// Check dependencies
console.log(`\n📚 Checking Dependencies:`);
const dependencies = [
  'express',
  'axios',
  'cors',
  'dotenv'
];

dependencies.forEach(dep => {
  try {
    require.resolve(dep);
    console.log(`✅ ${dep}: Installed`);
  } catch (e) {
    console.log(`❌ ${dep}: Not installed`);
  }
});

// Test network connectivity
console.log(`\n🌐 Network Check:`);
const testUrl = 'https://www.google.com';
https.get(testUrl, (res) => {
  console.log(`✅ Internet connectivity: OK (Status: ${res.statusCode})`);
}).on('error', (err) => {
  console.log(`❌ Internet connectivity: Failed - ${err.message}`);
});

// Summary
setTimeout(() => {
  console.log(`\n📊 Deployment Readiness Summary:`);
  const envVarsSet = requiredEnvVars.filter(v => process.env[v]).length;
  const envVarsTotal = requiredEnvVars.length;
  console.log(`Environment Variables: ${envVarsSet}/${envVarsTotal} configured`);
  
  if (envVarsSet === envVarsTotal) {
    console.log(`\n✅ System is ready for deployment!`);
  } else {
    console.log(`\n⚠️  Missing configuration. Please set all environment variables.`);
  }
}, 1000);
