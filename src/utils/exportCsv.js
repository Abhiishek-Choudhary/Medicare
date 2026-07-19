// Serialize any value to a CSV-safe cell.
// Rules: if the string contains ",", newline, or ", wrap in " and double-escape internal ".
const cell = (raw) => {
    if (raw === null || raw === undefined) return '';
    let v = typeof raw === 'object' ? JSON.stringify(raw) : String(raw);
    if (v.includes('"') || v.includes(',') || v.includes('\n') || v.includes('\r')) {
        v = `"${v.replace(/"/g, '""')}"`;
    }
    return v;
};

/**
 * Build a CSV string from rows.
 * @param {Array<Object>} rows
 * @param {Array<{key: string, label?: string, accessor?: (row) => any}>} columns
 */
export const buildCsv = (rows, columns) => {
    const header = columns.map((c) => cell(c.label || c.key)).join(',');
    const body = rows
        .map((r) => columns
            .map((c) => cell(c.accessor ? c.accessor(r) : r[c.key]))
            .join(','))
        .join('\n');
    return `${header}\n${body}`;
};

/**
 * Trigger a download of the CSV.
 */
export const downloadCsv = (filename, rows, columns) => {
    if (!rows || rows.length === 0) return;
    const csv = buildCsv(rows, columns);
    // Prepend BOM so Excel opens UTF-8 correctly
    const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Common accessors reused across tables
export const fmtDate = (d) => d ? new Date(d).toISOString() : '';
