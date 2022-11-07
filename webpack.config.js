const path = require('path');
const { mkdirpSync, copySync, removeSync } = require('fs-extra');

const rootDir = __dirname;
const distDir = path.resolve(__dirname, 'dist');

removeSync(distDir);
mkdirpSync(distDir);

copySync(rootDir + '/manifest.json', 'dist/manifest.json');
copySync(rootDir + '/icon16.png', 'dist/icon16.png');
copySync(rootDir + '/icon32.png', 'dist/icon32.png');
copySync(rootDir + '/icon48.png', 'dist/icon48.png');
copySync(rootDir + '/icon128.png', 'dist/icon128.png');

module.exports = {
	mode: 'production',
	entry: './src/content.js',
	output: {
		path: path.resolve(distDir, 'scripts'),
		filename: 'content.js',
	},
};
