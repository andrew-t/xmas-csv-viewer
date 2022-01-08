import { setTree, setEffect, setSixty, setSpin, go } from './tree.js'

document.addEventListener('DOMContentLoaded', async e => {
	const tree = document.getElementById('tree');
	const effect = document.getElementById('effect');
	const sixty = document.getElementById('60fps');
	const spin = document.getElementById('spin');
	notCustom(tree);
	notCustom(effect);
	tree.addEventListener('change', orCustom(setTree, 'coords'));
	effect.addEventListener('change', orCustom(setEffect, 'effects'));
	sixty.addEventListener('change', e => setSixty(sixty.checked));
	spin.addEventListener('change', e => setSpin(spin.checked));
	await setTree(`coords/${tree.value}.csv`);
	await setEffect(`effects/${effect.value}.csv`);
	setSixty(sixty.checked);
	setSpin(spin.checked);
	go();
});

function notCustom(el) {
	if (el.value == 'custom' || el.value == '')
		el.value = el.querySelector('option').getAttribute('value');
}

let lastListener = null;
function orCustom(cb, folder) {
	return e => {
		const { target } = e, { value } = target;
		if (value != 'custom') return cb(`${folder}/${value}.csv`);
		const upload = document.getElementById('upload');
		if (lastListener) upload.removeEventListener('change', lastListener);
		lastListener = accept;
		upload.addEventListener('change', accept);
		upload.click();
		function accept(e) {
			lastListener = null;
			if (upload.files.length != 1) return;
			const [file] = upload.files;
			const reader = new FileReader();
			reader.addEventListener('load', e => {
				try {
					cb(e.target.result);
					target.value = 'uploaded-file';
				}
				catch (e) {
					console.error(e);
					alert(e.message);
				}
			});
			reader.readAsText(file, 'utf-8');
		}
	};
}
