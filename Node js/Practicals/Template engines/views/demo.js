const ejs = require("ejs");


// Approach 1

let template = `
  <h2>Hello <%= name %>!</h2>
  <p>Today is <%= date %></p>
  <p>1 + 2 is <%= 1 + 2 %></p>
`;
const output = ejs.render(template, {
	name: "John",
	date: new Date().toISOString().split("T")[0],
});

console.log(output);

// Approach 2

const renderTemplate = ejs.compile(`
  <h2>Hello <%= name %>!</h2>
  <p>Today is <%= date %></p>
  <p>1 + 2 is <%= 1 + 2 %></p>
`);

console.log(
	renderTemplate({
		name: "John",
		date: new Date().toISOString().split("T")[0],
	})
);



// output
//	<h2>Hello John!</h2>
//	<p>Today is 2025-03-25</p>
//	<p>1 + 2 is 3</p>