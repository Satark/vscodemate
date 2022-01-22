import * as vscode from "vscode";
import {search} from "./utils/search";

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension is now active!');
	const provider: vscode.InlineCompletionItemProvider<vscode.InlineCompletionItem> = {
		provideInlineCompletionItems: async (document, position, context, token) => {
			const textBeforeCursor = document.getText(
				new vscode.Range(position.with(undefined, 0), position)
			);

			let rs;
			try {
				rs = await search(textBeforeCursor);
			} catch (err: unknown) {
				if (err instanceof Error) {
					vscode.window.showErrorMessage(err.toString());
				}
				return { items: [] };
			}

			if (rs === null) {
				return { items: [] };
			}

			const items = rs.results.map(item => {
				const output = `\n${item}`;
				return {
					text: output,
					range: new vscode.Range(position.translate(0, output.length), position)
				} as vscode.InlineCompletionItem;
			});

			return { items };

		},
	};

	vscode.languages.registerInlineCompletionItemProvider({ pattern: "**" }, provider);
};

// this method is called when your extension is deactivated
export function deactivate() {}
