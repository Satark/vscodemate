import * as vscode from "vscode";

type IConfig = {
    settings: {
        url: string,
        token: string,
        maxResults: number
    }
};

export function getConfig() {
    const config = vscode.workspace.getConfiguration("vscodemate");

    return {
        settings: {
            url: config.settings.url,
            token: config.settings.token,
            maxResults: config.settings.maxResults
        }
    } as IConfig;
};
