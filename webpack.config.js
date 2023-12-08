const path = require('path');
const { mkdirpSync, copySync, removeSync } = require('fs-extra');

const rootDir = __dirname;
const distDir = path.resolve(__dirname, 'dist', 'chrome');

removeSync(distDir);
mkdirpSync(distDir);

copySync(rootDir + '/manifest.json', distDir + '/manifest.json');
copySync(rootDir + '/icon16.png', distDir + '/icon16.png');
copySync(rootDir + '/icon32.png', distDir + '/icon32.png');
copySync(rootDir + '/icon48.png', distDir + '/icon48.png');
copySync(rootDir + '/icon128.png', distDir + '/icon128.png');

module.exports = {
	mode: 'production',
	entry: './src/content.js',
	output: {
		path: path.resolve(distDir, 'scripts'),
		filename: 'content.js',
	},
};
