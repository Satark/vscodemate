import {ExtensionContext, languages} from "vscode";
import {SmallCloudCodeLensProvider} from "./codelens/codeLensProvider";
import {SmallCloudInlineCompletionProvider} from "./inlineCompletions/inlineCompletionProvider";

export function activate(context: ExtensionContext) {
	console.log('Congratulations, your extension is now active!');
	const inlineCompletionProvider = new SmallCloudInlineCompletionProvider();
	languages.registerInlineCompletionItemProvider({ pattern: "**" }, inlineCompletionProvider);

	const codeLensProvider = new SmallCloudCodeLensProvider();
	languages.registerCodeLensProvider("*", codeLensProvider);
};

// this method is called when your extension is deactivated
export function deactivate() {}
