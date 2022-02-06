import {
	CancellationToken,
	CodeLens,
	CodeLensProvider,
	Command,
	commands,
	DocumentSelector,
	DocumentSymbol,
	Event,
	EventEmitter,
	Location,
	Position,
	Range,
	SymbolInformation,
	SymbolKind,
	TextDocument,
	Uri,
} from "vscode";

import {
	BuiltInCommands
} from "../constants";

export class SimpleCodeLens extends CodeLens {
	constructor(
		public readonly languageId: string,
		public readonly symbol: DocumentSymbol | SymbolInformation,
		range: Range
	) {
		super(range);
	}
}

export class SmallCloudCodeLensProvider implements CodeLensProvider {
	private _onDidChangeCodeLenses = new EventEmitter<void>();
	get onDidChangeCodeLenses(): Event<void> {
		return this._onDidChangeCodeLenses.event;
	}

	reset(_reason?: 'idle' | 'saved') {
		this._onDidChangeCodeLenses.fire();
	}

	async provideCodeLenses(document: TextDocument, token: CancellationToken): Promise<CodeLens[]> {
		const lenses: CodeLens[] = [];
		if (token.isCancellationRequested) {
			 return lenses;
		}

		const symbols = await commands.executeCommand<SymbolInformation[]>(
			BuiltInCommands.ExecuteDocumentSymbolProvider,
			document.uri,
		);
		for (const symbol of symbols) {
			lenses.push(
				new SimpleCodeLens(
					document.languageId,
					symbol,
					symbol.location.range,
				),
			);
			lenses.push(
				new SimpleCodeLens(
					document.languageId,
					symbol,
					symbol.location.range,
				),
			);
			if (token.isCancellationRequested) {
				return lenses;
			}
		}
		return lenses;
	}


	resolveCodeLens(lens: CodeLens, token: CancellationToken): CodeLens | Promise<CodeLens> {
		if (lens instanceof SimpleCodeLens) {
			return this.resolveSimpleCodeLens(lens, token);
		}
		return Promise.reject<CodeLens>(undefined);
	}

	private resolveSimpleCodeLens(lens: SimpleCodeLens, _token: CancellationToken): CodeLens {
		let title = "Make everything ok";
		return this.applyCommandWithNoClickAction(title, lens);
	}

	private applyCommandWithNoClickAction<T extends SimpleCodeLens>(
		title: string,
		lens: T,
	): T {
		lens.command = {
			title: title,
			command: BuiltInCommands.Diff,
		};
		return lens;
	}

	/*
	private applyDiffWithPreviousCommand<T extends GitRecentChangeCodeLens | GitAuthorsCodeLens>(
		title: string,
		lens: T,
		commit: GitCommit | undefined,
	): T {
		lens.command = command<[undefined, DiffWithPreviousCommandArgs]>({
			title: title,
			command: Commands.DiffWithPrevious,
			arguments: [
				undefined,
				{
					commit: commit,
					uri: lens.uri!.toFileUri(),
				},
			],
		});
		return lens;
	}
	*/
}

/*
function getRangeFromSymbol(symbol: DocumentSymbol | SymbolInformation) {
	return isDocumentSymbol(symbol) ? symbol.range : symbol.location.range;
}

function isDocumentSymbol(symbol: DocumentSymbol | SymbolInformation): symbol is DocumentSymbol {
	return is<DocumentSymbol>(symbol, 'children');
}
*/
