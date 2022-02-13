import * as vscode from "vscode";
import axios from "axios";
import * as https from "https";
import { getConfig } from "../config";


export async function getCompletions(currentLine: string, textBefore: string, textAfter: string, maxCompletions: number = 3): Promise<null | { results: string[] }> {
    const config = getConfig();
    const secretKey = config.settings.token;
    const requestUrl = config.settings.url + "/get_completions";

    /* eslint "no-async-promise-executor": "off" */
    const promise = new Promise<{ results: string[] }>(async (resolve, reject) => {
        let results: string[] = [];

        try {
            const payload = {
                text_before: textBefore,
                current_line: currentLine,
                text_after: textAfter,
                max_completions: maxCompletions
            };
            const agent = new https.Agent({
                rejectUnauthorized: false
            });
            const headers = {
                secret_key: secretKey
            };

            const response = await axios.post(requestUrl, payload, {httpsAgent: agent, headers: headers});

            if (response.status === 200) {
                const completions = response.data.completions || [];
                for(const c of completions) {
                    results.push(c.text);
                }

                vscode.window.setStatusBarMessage(`VSCodeMate: ${results.length} results`, 2000);
            } else {
                vscode.window.setStatusBarMessage(`VSCodeMate error: ${response.data.error.message}`, 2000);
                reject(response.data.error.message);
            }

            resolve({ results });
        } catch (err) {
            reject(err);
        }

        vscode.window.setStatusBarMessage(`VSCodeMate: Finished loading ${results.length} results`);
    });

    vscode.window.setStatusBarMessage(`VSCodeMate: Start loading...`, promise);
    return promise;
};
