import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const SHEET_IDS = {
    TASKS: "1s2zxsgU1oNdcJFaxdTKLe0yrHBe7ecVHKrQeBiNqTmk",
    USERS: "1RHqm2pNXDp99RN9dcy6gEFcoXP4Ah0sHec5AsF-qRl4",
    TEAMS: "1_dNoxx2kQmPHlzkY7ibTj6UoXMzeBJ5YwWwCfdEx3l0",
};

export class GoogleSheetsService {
    private auth;
    private sheets;

    constructor() {
        const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');

        this.auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: privateKey,
            },
            scopes: SCOPES,
        });

        this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    }

    async getRows(sheetId: string, range: string = 'A:Z') {
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: sheetId,
                range,
            });
            return response.data.values || [];
        } catch (error) {
            console.error(`Error reading sheet ${sheetId}:`, error);
            throw error;
        }
    }

    async appendRow(sheetId: string, values: any[]) {
        try {
            const response = await this.sheets.spreadsheets.values.append({
                spreadsheetId: sheetId,
                range: 'A1',
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [values],
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error appending to sheet ${sheetId}:`, error);
            throw error;
        }
    }

    async updateRow(sheetId: string, range: string, values: any[]) {
        try {
            const response = await this.sheets.spreadsheets.values.update({
                spreadsheetId: sheetId,
                range,
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [values],
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating sheet ${sheetId}:`, error);
            throw error;
        }
    }

    async deleteRow(sheetId: string, rowIndex: number) {
        // Google Sheets API delete row is a batchUpdate
        try {
            const request = {
                spreadsheetId: sheetId,
                resource: {
                    requests: [{
                        deleteDimension: {
                            range: {
                                sheetId: 0, // Assuming first sheet, need to verify if we have multiple sheets/tabs
                                dimension: "ROWS",
                                startIndex: rowIndex,
                                endIndex: rowIndex + 1
                            }
                        }
                    }]
                }
            };
            // Note: deleteDimension requires sheetId (integer), not spreadsheetId (string). 
            // We need to fetch sheet metadata to get the sheetId (gid) if it's not 0.
            // For now, assuming the first sheet (gid=0) is what we want, but this is risky.
            // Better approach for "deleting" might be clearing the row or marking as deleted if we want to be safe,
            // or we need to implement a way to get the GID.

            // Let's implement a safer "clear row" or just accept we need the GID.
            // Actually, for a simple "database" replacement, usually we just filter out things.
            // But if we must delete, we need the GID.

            // For now, let's hold off on physical deletion until we confirm GIDs or if we can just use a status column.
            console.warn("Delete row not fully implemented without GID lookup.");
        } catch (error) {
            console.error("Error deleting row:", error);
            throw error;
        }
    }

    // Helper to get Sheet IDs
    static get SHEET_IDS() {
        return SHEET_IDS;
    }
}

export const googleSheetsService = new GoogleSheetsService();
