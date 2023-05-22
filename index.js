var lives_lost = 0;
var container = document.getElementsByClassName("container")[0];
var img = document.getElementsByClassName("hangman")[0];
var term = document.getElementsByClassName("term")[0];
var vocab = "";
var found = [];

function extract(csvPath) {
	return fetch(csvPath)
		.then(response => response.text())
		.then(data => {
			const rows = data.split("\n");
			if (rows[0].includes(',')) {
				rows.shift();
			}
			const elem = rows[Math.floor(Math.random() * rows.length)];

			const columns = elem.split(',');
			const trimmed = columns.map(column => column.trim());
			return trimmed;
		});
}

function startup(pd) {
	let value = extract(`terms/Unit_${pd}.csv`);
	value.then(val => interpret(pd, val));
}

function interpret(pd, val) {
	let container = document.getElementsByClassName("container")[0];
	container.innerHTML = `<h2>Period ${pd} Review!</h2>`;

	vocab = val[0];

	let temp_str = "<h1>";
	for (let i = 0; i < vocab.length; i++) {
		if (vocab[i] === " ") {
			temp_str += "<br>";
		} else if (vocab[i] === "'" || vocab[i] === "-") {
			temp_str += vocab[i];
		} else {
			temp_str += "_";
		}
		if (i != vocab.length - 1) {
			temp_str += " ";
		}
	}
	term.innerHTML = temp_str + "</h1>";

	temp_str = "";
	for (let i = 0; i < 26; i++) {
		let c = String.fromCharCode(65+i);
		temp_str += `<button class="letter" onclick="chk('${c}')">${c}</button>`;
	}
	container.innerHTML = container.innerHTML + "<br>" + temp_str;

	img.innerHTML = "<img src=\"images/loss0.jpg\">";
	found = [];
}

function chk(c) {
	if (found.includes(c)) {
		return;
	}
	found.push(c);
	let temp_str = "<h1>";
	let cnt = 0;
	let blanks = 0;

	for (let i = 0; i < vocab.length; i++) {
		if (vocab[i] === " ") {
			temp_str += "<br>";
		} else {
			let worked = false;
			for (let j = 0; j < found.length; j++) {
				if (vocab[i] === found[j]) {
					temp_str += vocab[i];
					worked = true;
					if (vocab[i] === c) {
						cnt++;
					}
					break;
				}
			}
			if (!worked) {
				if (vocab[i] === "'" || vocab[i] === "-") {
					temp_str += vocab[i];
				} else {
					temp_str += "_";
					blanks++;
				}
			}
		}
		if (i != vocab.length - 1) {
			temp_str += " ";
		}
	}
	term.innerHTML = temp_str + "</h1>";
	if (cnt == 0) {
		lives_lost++;
	}
	img.innerHTML = `<img src="images/loss${lives_lost}.jpg">`;

	if (blanks === 0 || lives_lost === 6) {
		end();
	}
}

function end() {
	container.innerHTML = `<h2>The word was: ${vocab}</h2>`;
}