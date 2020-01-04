#!/usr/bin/env node
 
const bot = require("circle-github-bot").create();

var fs = require("fs");
var files = fs.readdirSync("/tmp/test-reports");
console.log(files);

// example listing
// 723350e.report.json
// c88ebe5-723350e.diff
// c88ebe5.report.json
let diff_file = files.filter(x => x.endsWith(".diff"))[0];
let diff_content = fs.readFileSync(diff_file, "utf8");
let [upstream, head] = diff_file.split(".")[0].split("-");

var content = "No changes detected.";
if (diff_content) {
    content = `#### ${diff_file}
    \`\`\`diff
    ${diff_content}
    \`\`\`
    `;
}

bot.comment(process.env.GH_AUTH_TOKEN, `
### Integration report for "${bot.env.commitMessage}"
Report for upstream: ${bot.artifactLink("app/test-report", upstream + ".report.json")}
Report for latest commit: ${bot.artifactLink("app/test-report", head + ".report.json")}

${content}
`);