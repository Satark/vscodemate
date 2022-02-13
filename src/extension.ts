import {ExtensionContext, languages, commands, window, TextDocumentShowOptions} from "vscode";
import {SmallCloudCodeLensProvider} from "./codelens/codeLensProvider";
import {SmallCloudHoverProvider} from "./hover/hoverProvider";
import {SmallCloudInlineCompletionProvider} from "./inlineCompletions/inlineCompletionProvider";
import {BuiltInCommands} from "./constants";

export function activate(context: ExtensionContext) {
	const inlineCompletionProvider = new SmallCloudInlineCompletionProvider();
	languages.registerInlineCompletionItemProvider({pattern: "**"}, inlineCompletionProvider);

	// const codeLensProvider = new SmallCloudCodeLensProvider();
	// languages.registerCodeLensProvider("*", codeLensProvider);

	// const hoverProvider = new SmallCloudHoverProvider();
	// languages.registerHoverProvider("*", hoverProvider);

	// ? CodeActionsProvider ?
	// ? Diagnostic ?
	// ? WorkspaceEdit ?

	const disposable = commands.registerCommand("vscodemate.enhance", async function () {
		// Get the active text editor
		const editor = window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;
			const cursorPos = selection.active;
			const enhancedUri = document.uri; // TODO get enhanced code, make uri for it TextDocumentContentProvider?
			await commands.executeCommand(BuiltInCommands.Diff, document.uri, enhancedUri, "enhance preview", {preview: true, preserveFocus: true, selection: selection} as TextDocumentShowOptions);
		}
	});

	context.subscriptions.push(disposable);
};

export function deactivate() {}
