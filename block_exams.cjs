const fs = require('fs');
const path = require('path');

const routes = [
  'src/routes/algoritmos/parcial-1/+page.svelte',
  'src/routes/algoritmos/parcial-2/+page.svelte',
  'src/routes/algoritmos/taller/+page.svelte',
  'src/routes/algoritmos/algoritmia/taller/+page.svelte',
  'src/routes/desarrollo-web-1/parcial-1/+page.svelte',
  'src/routes/desarrollo-web-1/parcial-2/+page.svelte',
  'src/routes/desarrollo-web-1/algoritmia/taller/+page.svelte',
  'src/routes/desarrollo-web-2/parcial-1/+page.svelte',
  'src/routes/desarrollo-web-2/parcial-2/+page.svelte',
  'src/routes/desarrollo-web-2/taller/+page.svelte',
  'src/routes/desarrollo-web-2/algoritmia/taller/+page.svelte',
];

const message = 'Una vez se asigne la fecha del taller o parcial en cuestión, ya se anunciará y se habilitará el acceso.';

for (const file of routes) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(/No tienes intentos disponibles en este momento\./g, message);
    content = content.replace(/No tienes intentos disponibles\./g, message);
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + file);
  }
}

// Block exam.js
const examJs = path.join(__dirname, 'src/lib/exam.js');
if (fs.existsSync(examJs)) {
  let content = fs.readFileSync(examJs, 'utf-8');
  content = content.replace(/new Date\(\d{4}, \d+, \d+, \d+, \d+\)/g, 'new Date(2027, 0, 1, 0, 0)');
  content = content.replace(/new Date\(\d{4}, \d+, \d+\)/g, 'new Date(2027, 0, 1)');
  fs.writeFileSync(examJs, content);
  console.log('Updated exam.js');
}

// Block tallerConfig.js
const tallerJs = path.join(__dirname, 'src/lib/tallerConfig.js');
if (fs.existsSync(tallerJs)) {
  let content = fs.readFileSync(tallerJs, 'utf-8');
  content = content.replace(/new Date\(y, m, d, \d+, \d+\)/g, 'new Date(2027, 0, 1, 0, 0)');
  fs.writeFileSync(tallerJs, content);
  console.log('Updated tallerConfig.js');
}
