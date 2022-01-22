import * as vscode from "vscode";
import axios from "axios";
import * as https from "https";
import { getConfig } from "../config";

/**
 * Cache results to avoid VSCode keep refetching
 */
const cachedResults: { [keyword: string]: string[] } = {};


export async function search(keyword: string): Promise<null | { results: string[] }> {
    if (keyword in cachedResults) {
        return Promise.resolve({ results: cachedResults[keyword] });
    }

    const config = getConfig();

    /* eslint "no-async-promise-executor": "off" */
    const promise = new Promise<{ results: string[] }>(async (resolve, reject) => {

        let results: string[] = [];
        let fetchResult: string;

        try {
             const payload = { "keyword": keyword, "token": config.settings.token };
             const agent = new https.Agent({
                rejectUnauthorized: false
              });
            const result = await axios.post(config.settings.url, payload, { httpsAgent: agent });

            if (result.status === 200) {
                // TODO parse results
                results = results.concat(result.data);
                vscode.window.setStatusBarMessage(`VSCodeMate: ${results.length} results`, 2000);
            } else {
                vscode.window.setStatusBarMessage(`VSCodeMate error: ${result.data.error.message}`, 2000);
                reject(result.data.error.message);
            }

            cachedResults[keyword] = results;
            resolve({ results });
        } catch (err) {
            reject(err);
        }

        vscode.window.setStatusBarMessage(`VSCodeMate: Finished loading ${results.length} results`);
    });

    vscode.window.setStatusBarMessage(`VSCodeMate: Start loading...`, promise);
    return promise;
};
