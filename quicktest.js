import { setTree, setEffect, setSixty, setSpin, go } from './tree.js'

async function start() {
	await setTree('coords/matt.csv');
	await setEffect('effects/lavalamp.csv');
	setSixty(false);
	setSpin(true);
	go();
}

start();
