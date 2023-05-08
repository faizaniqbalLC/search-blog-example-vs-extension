const vscode = require("vscode");
const axios = require("axios");  
const xmlParser = require("fast-xml-parser");
const parser = new xmlParser.XMLParser();
/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  const res = await axios.get("https://blog.webdevsimplified.com/rss.xml");

  const articles = parser.parse(res.data).rss.channel.item.map((article) => ({
    label: article.title,
    detail: article.description,
    link: article.link,
  }));

  let disposable = vscode.commands.registerCommand(
    "search-blog-example.searchBlogExample",
    async function () {
      const article = await vscode.window.showQuickPick(articles, {
        matchOnDetail: true,
      });
      if (article == null) return;
      vscode.env.openExternal(article.link);
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
