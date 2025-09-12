import { google } from "googleapis";

const sheets = google.sheets({
  version: "v4",
  auth: process.env.GOOGLE_API_KEY,
});

export const SPREADSHEET_ID = process.env.SPREADSHEET_ID!;

export const fetchSheetData = async (sheetName: string) => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:G`,
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) return [];

  //  sheet columns: Lead Name | Email | Phone | Status | CallbackBooked | AgentMessages | Notes/Data
  return rows.slice(1).map((row) => ({
    leadName: row[0] || "",
    leadEmail: row[1] || "",
    leadPhone: row[2] || "",
    status: row[3] || "",
    callbackBooked: row[4] === "TRUE" || false,
    agentMessages: row[5] ? JSON.parse(row[5]) : [],
    data: row[6] || "",
  }));
};
