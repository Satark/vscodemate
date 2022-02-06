import {
	HoverProvider,
	DocumentSelector,
	TextDocument,
	Hover,
	Position,
	Range,
	CancellationToken
} from "vscode";

export class SmallCloudHoverProvider implements HoverProvider {
	public getDocumentSelector(): DocumentSelector {
		return {pattern: "**"};
	}
	public provideHover(document: TextDocument, position: Position, token: CancellationToken): Promise<Hover> | undefined {
		const range = document.getWordRangeAtPosition(position);
		if (!range) {
			return;
		}

		const hoveredWord = document.getText(range);
		const word = hoveredWord.slice(20, -20);

	}
}

