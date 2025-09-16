import { google } from "googleapis";
console.log;
const sheets = google.sheets({
  version: "v4",
  auth: process.env.GOOGLE_API_KEY,
});

export const fetchSheetData = async (
  sheetName: string,
  spreadSheetUrl: string
) => {
  const spreadSheetId = getSheetIdFromUrl(spreadSheetUrl);
  if (!spreadSheetId) return [];
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadSheetId,
    range: `'${sheetName}'!A:G`,
  });

  console.log(response.data.values);
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

function getSheetIdFromUrl(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}
