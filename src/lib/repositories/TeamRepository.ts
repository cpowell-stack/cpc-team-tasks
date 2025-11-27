import { googleSheetsService, GoogleSheetsService } from '../googleSheets';

export interface Team {
    id: string;
    name: string;
}

export class TeamRepository {
    private sheetId = GoogleSheetsService.SHEET_IDS.TEAMS;

    async getAllTeams(): Promise<Team[]> {
        const rows = await googleSheetsService.getRows(this.sheetId);
        const headers = rows[0];
        return rows.slice(1).map(row => this.mapRowToTeam(row, headers));
    }

    async updateTeam(id: string, data: Partial<Team>): Promise<void> {
        const rows = await googleSheetsService.getRows(this.sheetId);
        const headers = rows[0];
        const idIndex = headers.indexOf('Row ID');
        if (idIndex === -1) throw new Error('Row ID column not found');

        const rowIndex = rows.findIndex(row => row[idIndex] === id);
        if (rowIndex === -1) throw new Error(`Team with ID ${id} not found`);

        const sheetRowNumber = rowIndex + 1;
        const currentRow = rows[rowIndex];
        const newRow = [...currentRow];

        const updateCol = (colName: string, value: any) => {
            const colIndex = headers.indexOf(colName);
            if (colIndex !== -1) {
                newRow[colIndex] = value;
            }
        };

        if (data.name !== undefined) updateCol('Title', data.name);

        await googleSheetsService.updateRow(this.sheetId, `A${sheetRowNumber}`, newRow);
    }

    private mapRowToTeam(row: any[], headers: string[]): Team {
        const getCol = (name: string) => {
            const index = headers.indexOf(name);
            return index !== -1 ? row[index] : undefined;
        };

        return {
            id: getCol('Row ID') || '',
            name: getCol('Title') || '',
        };
    }
}

export const teamRepository = new TeamRepository();
