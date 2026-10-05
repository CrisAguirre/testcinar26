const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file === '+page.svelte') {
            let content = fs.readFileSync(fullPath, 'utf8');
            let changed = false;

            // Fix h1 titles missing background-clip
            if (content.includes('background: linear-gradient') && content.includes('color: #0f172a;') && content.includes('animation: bannerTitleGrad')) {
                const newContent = content.replace(
                    /color:\s*#0f172a;/g, 
                    '-webkit-background-clip: text;\n    -webkit-text-fill-color: transparent;\n    background-clip: text;\n    color: transparent;'
                );
                if (content !== newContent) {
                    fs.writeFileSync(fullPath, newContent, 'utf8');
                    console.log('Fixed h1 gradient in ' + fullPath);
                }
            }
        }
    }
}

processDir(path.join(process.cwd(), 'src/routes'));
