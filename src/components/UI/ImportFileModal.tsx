import React, { Dispatch, useRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Button, DialogActions, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useReduxDispatch, useReduxSelector } from '../../store/Store';
import { tableActions } from '../../store/appSlices/TableSlice';
import { useTranslation } from 'react-i18next';
import { KeyedMutator } from 'swr';
import DragDrop from './DragDrop';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

type ImportFileModalProps = {
  mutate?: KeyedMutator<any>;
  setData: Dispatch<React.SetStateAction<any>>;
  setPartnerIds: Dispatch<React.SetStateAction<number[]>>;
  setCount: Dispatch<React.SetStateAction<any>>;
  setApiInit: Dispatch<React.SetStateAction<boolean>>;
};

const Transition = React.forwardRef(function Transition(props: TransitionProps & { children: React.ReactElement<any, any> }, ref: React.Ref<unknown>) {
  return <Slide direction="up" mountOnEnter unmountOnExit ref={ref} {...props} onExited={() => {}} />;
});

export const ImportFileModal: React.FC<ImportFileModalProps> = ({ mutate, setData, setPartnerIds, setCount, setApiInit }) => {
  const { t } = useTranslation(['bulkinvoice']);
  const dispatch = useReduxDispatch();
  const isBulkInvoiceImportModalOpen = useReduxSelector((state) => state.table.isBulkInvoiceImportModalOpen);
  const [files, setFiles] = useState<File[]>([]);
  const parseData = useRef<any>([]);
  const parseDataId = useRef<number[]>([]);
  const parseCount = useRef<number>(0);
  const [xlsxData, setXlsxData] = useState('');

  const handleClose = () => {
    dispatch(tableActions.setIsBulkInvoiceImportModalOpen(false));
  };

  const handleConvertXlsx = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const data = file;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      setXlsxData(JSON.stringify(json, null, 2));
    };
    reader.onerror = () => console.log('error');
    reader.readAsArrayBuffer(file);
  };

  const handleConvertCsv = (file: File) => {
    Papa.parse(file, {
      worker: true,
      step: function (row: any) {
        parseData.current.push(row.data);
        parseDataId.current.push(parseInt(row.data.partner_id));
        parseCount.current += 1;
      },
      complete: function () {
        setData(parseData.current);
        setPartnerIds(parseDataId.current);
        setCount(parseCount.current);
        setApiInit(true);
      },
      header: true,
    });
  };

  const handleImport = () => {
    const fileType = files[0].type;
    if (fileType === 'text/csv') {
      handleConvertCsv(files[0]);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      handleConvertXlsx(files[0]);
    }
    handleClose();
  };

  return (
    <React.Fragment>
      <Dialog open={isBulkInvoiceImportModalOpen} TransitionComponent={Transition} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description" className="w-full">
        <div className="flex w-[400px]">
          <DialogTitle className="text-blue-600" variant="h5">
            {t('bulkInvoiceImportModal', { ns: ['bulkinvoice'] })}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'blue',
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent>
          <DragDrop onFilesSelected={setFiles} text={t('dragDropText', { ns: ['bulkinvoice'] })} textSupported={t('dragDropTextSupported', { ns: ['bulkinvoice'] })} />
          <div className="mt-1">
            {parseCount.current > 0 && (
              <DialogContentText id="dialog-slide-description">
                {t('importedRows', { ns: ['bulkinvoice'] })} {parseCount.current}
              </DialogContentText>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <div className="flex gap-9 mr-7 mb-7">
            <Button onClick={handleClose}>
              <span className="bg-transparent text-red-500 px-4 border border-red-500 hover:bg-red-500 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                {t('cancel', { ns: ['bulkinvoice'] })}
              </span>
            </Button>
            {files.length > 0 ? (
              <Button onClick={handleImport}>
                <span className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                  {t('import', { ns: ['bulkinvoice'] })}
                </span>
              </Button>
            ) : (
              <></>
            )}
          </div>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
