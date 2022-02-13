import {
	CancellationToken,
	Position,
	TextDocument,
	InlineCompletionContext,
	InlineCompletionItemProvider,
	InlineCompletionItem,
	Range,
	window,
	InlineCompletionTriggerKind
} from "vscode";
import {getCompletions} from "../utils/network";

const maxLines = 1000; // TODO move to settings

export class SmallCloudInlineCompletionProvider implements InlineCompletionItemProvider<InlineCompletionItem> {
	async provideInlineCompletionItems(document: TextDocument, position: Position, context: InlineCompletionContext, token: CancellationToken) {
		if (context.triggerKind === InlineCompletionTriggerKind.Automatic) {
			return { items: [] };
		}
		const startLine = position.line > maxLines ? position.line - maxLines : 0;

		const currentLine = document.getText(
			new Range(position.with(undefined, 0), position)
		);

		const textBefore = document.getText(
			new Range(position.with(startLine, 0), position.with(undefined, 0))
		);
		const endLine = document.lineCount > maxLines ? maxLines : document.lineCount - 1;
		const lastLine = document.lineAt(endLine);
		const textAfter = document.getText(
			new Range(position, lastLine.range.end)
		);

		if (token.isCancellationRequested) {
			return { items: [] };
		}

		let rs;
		try {
			rs = await getCompletions(currentLine, textBefore, textAfter);
		} catch (err: unknown) {
			if (err instanceof Error) {
				window.showErrorMessage(err.toString());
			}
			return { items: [] };
		}

		if (rs === null || token.isCancellationRequested) {
			return { items: [] };
		}

		const items = rs.results.map(item => {
			const output = `\n${item}`;
			return {
				text: output,
				range: new Range(position.translate(0, output.length), position)
			} as InlineCompletionItem;
		});

		return {items};
	}
}
