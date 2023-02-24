const fs = require("fs");

const pages = fs.readdirSync("content");

pages.forEach((page) => {
	if (fs.existsSync(page)) {
		fs.rmSync(page, { recursive: true, force: true });
	}

	fs.mkdirSync(page);

	const template = fs.readFileSync(`templates/${page}.html`).toString();

	const regex = /\{[a-zA-Z\-_]+\}/g;

	let fields = template.match(regex);

	fields = fields.map((field) => field.replace(/[{}]/g, ""));

	const dataFilenames = fs.readdirSync(`content/${page}`);
	const data = dataFilenames.map((filename) =>
		JSON.parse(fs.readFileSync(`content/${page}/${filename}`))
	);

	data.forEach((entry, index) => {
		let entryCode = template;

		fields.forEach((field) => {
			entryCode = entryCode.replace(`{${field}}`, entry[field]);
		});

		const dir = `${page}/${dataFilenames[index].replace(".json", "")}`;

		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}

		fs.writeFileSync(`${dir}/index.html`, entryCode);
	});
});
