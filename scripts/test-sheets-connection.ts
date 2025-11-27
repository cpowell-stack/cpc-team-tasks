import 'dotenv/config';
import { googleSheetsService, GoogleSheetsService } from '../src/lib/googleSheets';


async function main() {
    console.log('Testing Google Sheets connection...');

    try {
        console.log('--- USERS SHEET ---');
        const userRows = await googleSheetsService.getRows(GoogleSheetsService.SHEET_IDS.USERS, 'A1:Z1');
        if (userRows.length > 0) {
            console.log('Headers:', userRows[0]);
        } else {
            console.log('No data found or empty sheet.');
        }

        console.log('\n--- TEAMS SHEET ---');
        const teamRows = await googleSheetsService.getRows(GoogleSheetsService.SHEET_IDS.TEAMS, 'A1:Z1');
        if (teamRows.length > 0) {
            console.log('Headers:', teamRows[0]);
        } else {
            console.log('No data found or empty sheet.');
        }

        console.log('\n--- TASKS SHEET ---');
        const taskRows = await googleSheetsService.getRows(GoogleSheetsService.SHEET_IDS.TASKS, 'A1:Z1');
        if (taskRows.length > 0) {
            console.log('Headers:', taskRows[0]);
        } else {
            console.log('No data found or empty sheet.');
        }

    } catch (error: any) {
        console.error('Connection failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

console.log('Private Key loaded:', !!process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);
console.log('Client Email loaded:', !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);

main();
