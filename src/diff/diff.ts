import {Event, TextDocument, TextDocumentChangeEvent} from "vscode";

export class DiffSender {
	cache_: {[uri: string]: string} = {};

	constructor(
		onDidOpenTextDocument: Event<TextDocument>,
		onDidChangeTextDocument: Event<TextDocumentChangeEvent>,
		onDidCloseTextDocument: Event<TextDocument>
	) {
		onDidOpenTextDocument((e) => this.textDocumentOpenHandler(e));
		onDidChangeTextDocument((e) => this.textDocumentEditHander(e));
		onDidCloseTextDocument((e) => this.textDocumentCloseHandler(e));
	}

	textDocumentOpenHandler(document: TextDocument) {
		this.cache_[document.uri.toString()] = document.getText();
	}

	textDocumentEditHander(event: TextDocumentChangeEvent) {
		this.cache_[event.document.uri.toString()] = event.document.getText();
	}

	textDocumentCloseHandler(document: TextDocument) {
		this.cache_[document.uri.toString()] = document.getText();
	}


}

