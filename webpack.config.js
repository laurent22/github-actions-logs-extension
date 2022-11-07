const path = require('path');
const { mkdirpSync, copySync, removeSync } = require('fs-extra');

const rootDir = __dirname;
const distDir = path.resolve(__dirname, 'dist');

removeSync(distDir);
mkdirpSync(distDir);

copySync(rootDir + '/manifest.json', 'dist/manifest.json');

module.exports = {
	mode: 'production',
	entry: './src/content.js',
	output: {
		path: path.resolve(distDir, 'scripts'),
		filename: 'content.js',
	},
};
