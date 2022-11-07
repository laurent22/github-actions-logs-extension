const execa = require('execa');

const distDir = __dirname + '/dist';

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

const main = async() => {
	process.chdir(distDir);
	await execCommand2(['7z', 'a', '-tzip', 'chrome.zip', '*']);
}

main().catch(error => {
	console.error(error);
	process.exit(1);
});
