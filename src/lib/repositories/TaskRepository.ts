import { googleSheetsService, GoogleSheetsService } from '../googleSheets';
import { v4 as uuidv4 } from 'uuid';

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: string;
    assigneeId?: string;
    teamId?: string;
    dueDate?: Date;
    priority?: string;
}

export class TaskRepository {
    private sheetId = GoogleSheetsService.SHEET_IDS.TASKS;

    async getTasks(): Promise<Task[]> {
        const rows = await googleSheetsService.getRows(this.sheetId);
        const headers = rows[0];
        return rows.slice(1).map(row => this.mapRowToTask(row, headers));
    }

    async createTask(task: Omit<Task, 'id'>): Promise<Task> {
        const newTask = { ...task, id: uuidv4() };
        const rows = await googleSheetsService.getRows(this.sheetId, 'A1:Z1');
        const headers = rows[0];

        const rowData = headers.map(header => {
            switch (header) {
                case 'Row ID': return newTask.id;
                case 'What': return newTask.title;
                case 'Notes': return newTask.description || '';
                case 'Progress': return newTask.status;
                case 'Responsible Person': return newTask.assigneeId || '';
                case 'Team': return newTask.teamId || '';
                case 'Target': return newTask.dueDate ? newTask.dueDate.toISOString() : '';
                case 'Priority': return newTask.priority || '';
                default: return '';
            }
        });

        await googleSheetsService.appendRow(this.sheetId, rowData);
        return newTask;
    }

    async updateTask(id: string, data: Partial<Task>): Promise<void> {
        const rows = await googleSheetsService.getRows(this.sheetId);
        const headers = rows[0];
        const idIndex = headers.indexOf('Row ID');
        if (idIndex === -1) throw new Error('Row ID column not found');

        const rowIndex = rows.findIndex(row => row[idIndex] === id);
        if (rowIndex === -1) throw new Error(`Task with ID ${id} not found`);

        // Google Sheets is 1-indexed, and we need to account for the header row if we were using A1 notation for the whole sheet
        // But rows array includes header at index 0.
        // So if rowIndex is 5 (6th row in array), it corresponds to row 6 in Sheets.
        const sheetRowNumber = rowIndex + 1;

        // We need to construct the new row preserving existing data
        const currentRow = rows[rowIndex];
        const newRow = [...currentRow];

        // Helper to update a column
        const updateCol = (colName: string, value: any) => {
            const colIndex = headers.indexOf(colName);
            if (colIndex !== -1) {
                newRow[colIndex] = value;
            }
        };

        if (data.title !== undefined) updateCol('What', data.title);
        if (data.description !== undefined) updateCol('Notes', data.description);
        if (data.status !== undefined) updateCol('Progress', data.status);
        if (data.assigneeId !== undefined) updateCol('Responsible Person', data.assigneeId);
        if (data.teamId !== undefined) updateCol('Team', data.teamId);
        if (data.dueDate !== undefined) updateCol('Target', data.dueDate ? data.dueDate.toISOString() : '');
        if (data.priority !== undefined) updateCol('Priority', data.priority);

        // Update the specific row
        // We need to calculate the range. Assuming headers length is Z (or we can just use the length of headers)
        // A better way is to just update the whole row.
        // Range: A{sheetRowNumber}:[LastColumnLetter]{sheetRowNumber}
        // For simplicity, let's assume we update columns A to Z (or however many headers we have)

        // We need to convert column index to letter if we want to be precise, or just use A{row}
        await googleSheetsService.updateRow(this.sheetId, `A${sheetRowNumber}`, newRow);
    }

    private mapRowToTask(row: any[], headers: string[]): Task {
        const getCol = (name: string) => {
            const index = headers.indexOf(name);
            return index !== -1 ? row[index] : undefined;
        };

        const dueDateStr = getCol('Target');

        return {
            id: getCol('Row ID') || '',
            title: getCol('What') || '',
            description: getCol('Notes'),
            status: getCol('Progress') || 'TODO',
            assigneeId: getCol('Responsible Person'),
            teamId: getCol('Team'),
            dueDate: dueDateStr ? new Date(dueDateStr) : undefined,
            priority: getCol('Priority'),
        };
    }
}

export const taskRepository = new TaskRepository();
