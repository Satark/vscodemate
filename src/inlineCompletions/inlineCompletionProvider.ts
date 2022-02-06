import {
	CancellationToken,
	Position,
	TextDocument,
	InlineCompletionContext,
	InlineCompletionItemProvider,
	InlineCompletionItem,
	Range,
	window
} from "vscode";
import {search} from "../utils/network";


export class SmallCloudInlineCompletionProvider implements InlineCompletionItemProvider<InlineCompletionItem> {
	async provideInlineCompletionItems(document: TextDocument, position: Position, context: InlineCompletionContext, token: CancellationToken) {
		const textBeforeCursor = document.getText(
			new Range(position.with(undefined, 0), position)
		);

		let rs;
		try {
			rs = await search(textBeforeCursor);
		} catch (err: unknown) {
			if (err instanceof Error) {
				window.showErrorMessage(err.toString());
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
				range: new Range(position.translate(0, output.length), position)
			} as InlineCompletionItem;
		});

		return {items};

	}
}
