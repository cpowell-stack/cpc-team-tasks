import { googleSheetsService, GoogleSheetsService } from '../googleSheets';

export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    role?: string;
    teamId?: string;
}

export class UserRepository {
    private sheetId = GoogleSheetsService.SHEET_IDS.USERS;

    async getUserByEmail(email: string): Promise<User | null> {
        const rows = await googleSheetsService.getRows(this.sheetId);
        const headers = rows[0];
        const emailIndex = headers.indexOf('Email');

        if (emailIndex === -1) return null;

        const userRow = rows.find((row: any[]) => row[emailIndex] === email);

        if (!userRow) return null;

        return this.mapRowToUser(userRow, headers);
    }

    async getAllUsers(): Promise<User[]> {
        const rows = await googleSheetsService.getRows(this.sheetId);
        const headers = rows[0];
        return rows.slice(1).map((row: any[]) => this.mapRowToUser(row, headers));
    }

    async updateUser(id: string, data: Partial<User>): Promise<void> {
        const rows = await googleSheetsService.getRows(this.sheetId);
        const headers = rows[0];
        const idIndex = headers.indexOf('Row ID');
        if (idIndex === -1) throw new Error('Row ID column not found');

        const rowIndex = rows.findIndex((row: any[]) => row[idIndex] === id);
        if (rowIndex === -1) throw new Error(`User with ID ${id} not found`);

        const sheetRowNumber = rowIndex + 1;
        const currentRow = rows[rowIndex];
        const newRow = [...currentRow];

        const updateCol = (colName: string, value: any) => {
            const colIndex = headers.indexOf(colName);
            if (colIndex !== -1) {
                newRow[colIndex] = value;
            }
        };

        if (data.name !== undefined) updateCol('Name', data.name);
        if (data.email !== undefined) updateCol('Email', data.email);
        if (data.image !== undefined) updateCol('Image', data.image);
        if (data.role !== undefined) updateCol('Role', data.role);
        if (data.teamId !== undefined) updateCol('Team ID', data.teamId);

        await googleSheetsService.updateRow(this.sheetId, `A${sheetRowNumber}`, newRow);
    }

    private mapRowToUser(row: any[], headers: string[]): User {
        const getCol = (name: string) => {
            const index = headers.indexOf(name);
            return index !== -1 ? row[index] : undefined;
        };

        return {
            id: getCol('Row ID') || '',
            name: getCol('Name') || '',
            email: getCol('Email') || '',
            image: getCol('Image') || '',
            role: getCol('Role'),
            teamId: getCol('Team ID'),
        };
    }
}

export const userRepository = new UserRepository();
