import { Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { downloadCsv } from '../../utils/exportCsv';

/**
 * <ExportButton filename="..." rows={data} columns={[{key, label, accessor}]} />
 */
function ExportButton({ filename, rows, columns, disabled }) {
    return (
        <Button
            size="small"
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            disabled={disabled || !rows || rows.length === 0}
            onClick={() => downloadCsv(filename, rows, columns)}
        >
            Export CSV
        </Button>
    );
}

export default ExportButton;
