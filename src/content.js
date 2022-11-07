const Convert = require('ansi-to-html');

const color = '#d1d7dd';
const bgColor = '#25292e';

const convert = new Convert();

const ansiToHtml = (ansi) => {
	const lines = ansi.split('\n');
	const converted = lines.map(l => convert.toHtml(l));
	return '<div style="background-color: ' + bgColor + '; color: ' + color + '; font-family: monospace; white-space: nowrap;">' + converted.join('<br/>') + '</div>';
}

const content = document.body.innerText;
document.body.innerHTML = ansiToHtml(content);
document.body.style.backgroundColor = bgColor;
