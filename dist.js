const execa = require('execa');
const { remove, copy, readFile, writeFile, mkdirp } = require('fs-extra');

const rootDir = __dirname;
const baseDistDir = rootDir + '/dist';
const sourceDistName = 'chrome';

const execCommand2 = async (command, options) => {
	options = {
		showInput: true,
		showStdout: true,
		showStderr: true,
		quiet: false,
		...options,
	};

	if (options.quiet) {
		options.showInput = false;
		options.showStdout = false;
		options.showStderr = false;
	}

	if (options.showInput) {
		console.info(`> ${command.join(' ')}`);
	}

	const args = command;
	const executableName = args[0];
	args.splice(0, 1);
	const promise = execa(executableName, args);
	if (options.showStdout) promise.stdout.pipe(process.stdout);
	if (options.showStderr) promise.stdout.pipe(process.stderr);
	const result = await promise;
	return result.stdout.trim();
}

const patchManifestForFirefox = async (inputPath) => {
	const content = JSON.parse(await readFile(inputPath, 'utf8'));

	content.browser_specific_settings = {
		gecko: {
			id: 'net.cozic.plugins.GitHubRawActionLogViewer@nospam',
		}
	}

	await writeFile(inputPath, JSON.stringify(content, null, '\t'));
}

const main = async() => {
	const distributions = [
		{
			name: 'chrome',
		},
		{
			name: 'firefox',
			postProcess: async () => {
				await patchManifestForFirefox(baseDistDir + '/firefox/manifest.json');
			},
		},
	];

	for (const dist of distributions) {
		if (dist.name !== sourceDistName) {
			await copy(baseDistDir + '/' + sourceDistName, baseDistDir + '/' + dist.name);
		}
	}

	for (const dist of distributions) {
		const distDir = baseDistDir + '/' + dist.name;
		const archiveName = dist.name + '.zip';
		process.chdir(distDir);
		await remove(archiveName);
		await execCommand2(['7z', 'a', '-tzip', archiveName, '*']);
	}

	for (const dist of distributions) {
		const distDir = baseDistDir + '/' + dist.name;
		const archiveName = dist.name + '.zip';
		process.chdir(distDir);
		await remove(archiveName);

		if (dist.postProcess) await dist.postProcess();

		await execCommand2(['7z', 'a', '-tzip', archiveName, '*']);
	}

	const sourceDir = baseDistDir + '/source';
	await remove(sourceDir);
	await mkdirp(sourceDir);
	await copy(rootDir + '/src', sourceDir + '/src');
	await copy(rootDir + '/dist.js', sourceDir + '/dist.js');
	await copy(rootDir + '/manifest.json', sourceDir + '/manifest.json');
	await copy(rootDir + '/package.json', sourceDir + '/package.json');
	await copy(rootDir + '/yarn.lock', sourceDir + '/yarn.lock');
	await copy(rootDir + '/icon16.png', sourceDir + '/icon16.png');
	await copy(rootDir + '/icon32.png', sourceDir + '/icon32.png');
	await copy(rootDir + '/icon48.png', sourceDir + '/icon48.png');
	await copy(rootDir + '/icon512.png', sourceDir + '/icon512.png');
	process.chdir(sourceDir);
	await execCommand2(['7z', 'a', '-tzip', 'source.zip', '*']);
}

main().catch(error => {
	console.error(error);
	process.exit(1);
});
