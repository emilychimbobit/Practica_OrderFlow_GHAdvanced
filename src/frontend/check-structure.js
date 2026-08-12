#!/bin/env node

// Test run: verifica que la carpeta frontend tenga los archivos necesarios
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'src/types/order.ts',
  'src/services/orderService.ts',
  'src/components/common/Button.tsx',
  'src/components/common/Input.tsx',
  'src/components/common/LoadingSpinner.tsx',
  'src/components/common/ErrorAlert.tsx',
  'src/components/orders/OrderList.tsx',
  'src/components/orders/CreateOrderForm.tsx',
  'src/pages/HomePage.tsx',
  'src/App.tsx',
  'src/main.tsx',
  'index.html',
  'package.json',
  'vite.config.ts',
  'tsconfig.json'
];

const baseDir = __dirname;
const missingFiles = [];

requiredFiles.forEach((file) => {
  const fullPath = path.join(baseDir, file);
  if (!fs.existsSync(fullPath)) {
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.error('❌ Missing files:');
  missingFiles.forEach((file) => console.error(`   - ${file}`));
  process.exit(1);
} else {
  console.log('✅ All frontend files present');
}
