import React, { MouseEvent, useCallback, useMemo, useState } from 'react';
import { Box, IconButton, Menu, MenuItem, SpeedDial, SpeedDialAction, Tooltip } from '@mui/material';
import { AddCircleOutline, FileDownload, Print, Save } from '@mui/icons-material';
import { tableVariables } from '../../../utils/variables';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs as FileSave } from 'file-saver';
import { DataColumnsProp } from '../../types/Table.type';
import { useTranslation } from 'react-i18next';
import { useReduxSelector } from '../../../store/Store';
import useTextToSpeech from '../../../logics/useTextToSpeech';

type TopToolCustomProps = {
  rows: any;
  visibleRows: any;
  selectedRowsIds: any;
  columns: any;
  dataName: string;
  dataColumns: DataColumnsProp[];
};

const menuItems = [
  { icon: <Print />, iconLabel: 'Print' },
  { icon: <FileDownload />, iconLabel: 'Pdf' },
  { icon: <Save />, iconLabel: 'Xlsx' },
];

export const TopToolCustom: React.FC<TopToolCustomProps> = ({ rows, visibleRows, selectedRowsIds, columns, dataName, dataColumns }) => {
  const { t } = useTranslation(['table']);
  const [openSpeedDial, setOpenSpeedDial] = useState(Array(3).fill(false));
  const [openExport, setOpenExport] = useState<null | HTMLElement>(null);

  const { handlePlay, handleStop } = useTextToSpeech();

  const filtered_rows = useCallback(
    (rows: any) => {
      const hiddenItems = dataColumns.map((item) => (item.hidden ? item.id : undefined)).filter((x) => x);

      if (hiddenItems.length > 0) {
        const filtered = rows.map((row: any) => {
          const values = structuredClone(row);
          hiddenItems.forEach((key) => delete values[key as keyof typeof values]);
          return Object.values(values);
        });
        return filtered;
      } else return rows.map((row: any) => Object.values(row));
    },
    [dataColumns],
  );

  const selectedRows = useMemo(() => {
    if (selectedRowsIds) {
      const rows_ = rows.filter((row: any) => selectedRowsIds.includes(row.id));
      return rows_;
    } else return [];
  }, [rows, selectedRowsIds]);

  const handlePrintRows = useCallback(
    (rows: any, columns: any, type: string) => {
      const printBlob = (blob: Blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const width = window.innerWidth;
        const height = window.innerHeight;
        const win = window.open(
          blobUrl,
          '_blank',
          `toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes,top=${height * 0.05},left=${width * 0.05},width=${width * 0.9},height=${height * 0.9}`,
        );
        if (!win) {
          alert('Please enable popups');
        } else {
          win.focus();
          setTimeout(function () {
            win.print();
            URL.revokeObjectURL(blobUrl);
            win.close();
          }, 1000);
        }
      };

      const doc = new jsPDF({ orientation: 'l', unit: 'pt', format: 'A4', compress: true });
      const tableData = filtered_rows(rows);
      const tableHeaders = columns.map((c: any) => c.header);
      const currDate = new Date().toLocaleDateString();
      const currTime = new Date().toLocaleTimeString();

      autoTable(doc, {
        head: [tableHeaders],
        body: tableData as any,
        startY: 20,
        theme: 'grid',
        showHead: 'everyPage',
        showFoot: 'everyPage',
        didDrawPage: (data) => {
          doc.setFontSize(10);
          doc.setTextColor(40);
          doc.text(`${dataName}_${type}_${currDate}_${currTime}`, data.settings.margin.left, 10);

          const str = 'Page ' + (doc as any).internal.getCurrentPageInfo().pageNumber;
          doc.setFontSize(10);
          const pageSize = doc.internal.pageSize;
          const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          doc.text(str, data.settings.margin.left, pageHeight - 10);
          printBlob(doc.output('blob'));
        },
      });
    },
    [dataName, filtered_rows],
  );

  const handlePdfExportRows = useCallback(
    (rows: any, type: string) => {
      const doc = new jsPDF({ orientation: 'l', unit: 'pt', format: 'A4', compress: true });
      const tableData = filtered_rows(rows);
      const tableHeaders = columns.map((c: any) => c.header);
      const currDate = new Date().toLocaleDateString();
      const currTime = new Date().toLocaleTimeString();
      autoTable(doc, {
        head: [tableHeaders],
        body: tableData as any,
        startY: 20,
        theme: 'grid',
        showHead: 'everyPage',
        showFoot: 'everyPage',
        didDrawPage: (data) => {
          doc.setFontSize(10);
          doc.setTextColor(40);
          doc.text(`${dataName}_${type}_${currDate}_${currTime}`, data.settings.margin.left, 10);

          const str = 'Page ' + (doc as any).internal.getCurrentPageInfo().pageNumber;
          doc.setFontSize(10);
          const pageSize = doc.internal.pageSize;
          const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          doc.text(str, data.settings.margin.left, pageHeight - 10);
        },
      });
      doc.save(`${dataName}_${type}_${currDate}_${currTime}.pdf`);
    },
    [columns, dataName, filtered_rows],
  );

  const handleXlsxExportRows = useCallback(
    (rows: any, type: string) => {
      const fileTypeXlsx = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtensionXlsx = '.xlsx';
      const currDate = new Date().toLocaleDateString();
      const currTime = new Date().toLocaleTimeString();
      const sheet_name = `${dataName}_${type}`;
      const tableData = filtered_rows(rows);
      const tableHeaders = columns.map((c: any) => c.header);

      const worksheetData = [tableHeaders, ...tableData];
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData as any);

      const cols = [];
      for (let i = 0; i < tableHeaders.length; i++) {
        let width = tableHeaders[i].length;
        for (let j = 1; j < worksheetData.length; j++) {
          const position = XLSX.utils.encode_cell({ r: j, c: i });
          const value = worksheet[position];
          if (value && value.v) {
            const valueString = value.v.toString();
            width = Math.max(width, valueString.length);
          }
        }
        width = Math.max(width, 3);
        cols.push({ wch: width + 1 });
      }
      worksheet['!cols'] = cols;
      XLSX.utils.book_append_sheet(workbook, worksheet, sheet_name);
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: fileTypeXlsx });
      FileSave(blob, `${dataName}_${type}_${currDate}_${currTime}${fileExtensionXlsx}`);
    },
    [columns, dataName, filtered_rows],
  );

  const speedDialActions = useMemo(
    () => [
      {
        icon: (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Print />
            <span className="text-[8px]">Page</span>
          </Box>
        ),
        name: t('printPageRows', { ns: ['table'] }),
        funcProp: () => handlePrintRows(visibleRows, columns, 'page'),
        valid: () => visibleRows.length !== 0,
        menuItemNumber: 0,
      },
      {
        icon: (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Print />
            <span className="text-[8px]">Select</span>
          </Box>
        ),
        name: t('printSelectedRows', { ns: ['table'] }),
        funcProp: () => handlePrintRows(selectedRows, columns, 'selected'),
        valid: () => selectedRows.length !== 0,
        menuItemNumber: 0,
      },
      {
        icon: (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <FileDownload />
            <span className="text-[8px]">All</span>
          </Box>
        ),
        name: t('pdfExportAllRows', { ns: ['table'] }),
        funcProp: () => handlePdfExportRows(rows, 'all'),
        valid: () => rows.length !== 0,
        menuItemNumber: 1,
      },
      {
        icon: (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <FileDownload />
            <span className="text-[8px]">Page</span>
          </Box>
        ),
        name: t('pdfExportPageRows', { ns: ['table'] }),
        funcProp: () => handlePdfExportRows(visibleRows, 'page'),
        valid: () => visibleRows.length !== 0,
        menuItemNumber: 1,
      },
      {
        icon: (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <FileDownload />
            <span className="text-[8px]">Select</span>
          </Box>
        ),
        name: t('pdfExportSelectedRows', { ns: ['table'] }),
        funcProp: () => handlePdfExportRows(selectedRows, 'selected'),
        valid: () => selectedRows.length !== 0,
        menuItemNumber: 1,
      },
      {
        icon: (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Save />
            <span className="text-[8px]">All</span>
          </Box>
        ),
        name: t('xlsxExportAllRows', { ns: ['table'] }),
        funcProp: () => handleXlsxExportRows(rows, 'all'),
        valid: () => rows.length !== 0,
        menuItemNumber: 2,
      },
      {
        icon: (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Save />
            <span className="text-[8px]">Page</span>
          </Box>
        ),
        name: t('xlsxExportPageRows', { ns: ['table'] }),
        funcProp: () => handleXlsxExportRows(visibleRows, 'page'),
        valid: () => visibleRows.length !== 0,
        menuItemNumber: 2,
      },
      {
        icon: (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Save />
            <span className="text-[8px]">Select</span>
          </Box>
        ),
        name: t('xlsxExportSelectedRows', { ns: ['table'] }),
        funcProp: () => handleXlsxExportRows(selectedRows, 'selected'),
        valid: () => selectedRows.length !== 0,
        menuItemNumber: 2,
      },
    ],
    [columns, handlePdfExportRows, handlePrintRows, handleXlsxExportRows, rows, selectedRows, t, visibleRows],
  );

  const handleOpenExport = (event: React.MouseEvent<HTMLElement>) => {
    setOpenExport(event.currentTarget);
  };

  const handleCloseExport = () => {
    setOpenExport(null);
  };

  const handleOpenSpeedDial = (num: number) => {
    const v = [...openSpeedDial];
    v[num] = true;
    setOpenSpeedDial(v);
  };

  const handleCloseSpeedDial = (num: number) => {
    const v = [...openSpeedDial];
    v[num] = false;
    setOpenSpeedDial(v);
  };

  const handleClickSpeedDialIcon = (num: number, e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>, funcProp: () => void) => {
    e.preventDefault();
    funcProp();
    handleCloseSpeedDial(num);
    handleCloseExport();
  };

  const isLightMode = useReduxSelector((state) => state.home.lightMode);
  const textColor = useMemo(() => (isLightMode ? tableVariables.titleTextColor : tableVariables.titleTextColorDark), [isLightMode]);

  return (
    <div className="flex">
      <div>
        <Tooltip sx={{ color: textColor }} arrow title={t('exportPrintData', { ns: ['table'] })}>
          <IconButton
            aria-controls="menu-export"
            aria-haspopup="true"
            onClick={handleOpenExport}
            onMouseEnter={() => handlePlay(t('exportPrintData', { ns: ['table'] }))}
            onMouseLeave={() => handleStop()}
          >
            <span className={`bg-transparent px-[5px] pb-[5px] ${tableVariables.buttonsColorHover} hover:text-white rounded-full `}>
              <AddCircleOutline sx={{ color: textColor, fontSize: 30 }} />
            </span>
          </IconButton>
        </Tooltip>

        <Menu
          sx={{ color: textColor }}
          id="menu-export"
          anchorEl={openExport}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={Boolean(openExport)}
          onClose={handleCloseExport}
        >
          {menuItems.map((item, index) => {
            return (
              <MenuItem sx={{ color: textColor }} key={index}>
                <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
                  <SpeedDial
                    ariaLabel="SpeedDial"
                    icon={
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {item.icon}
                        <span className="text-[9px]">{item.iconLabel}</span>
                      </Box>
                    }
                    direction="right"
                    onOpen={() => handleOpenSpeedDial(index)}
                    onClose={() => handleCloseSpeedDial(index)}
                    open={openSpeedDial[index]}
                    sx={{ '& .MuiFab-primary': { width: 45, height: 45, backgroundColor: 'primary', color: 'white', variant: 'extended' } }}
                  >
                    {speedDialActions.map((action) => {
                      return (
                        action.valid() &&
                        action.menuItemNumber === index && (
                          <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            tooltipPlacement="bottom"
                            onClick={(e) => handleClickSpeedDialIcon(index, e, action.funcProp)}
                            onMouseEnter={() => handlePlay(action.name)}
                            onMouseLeave={() => handleStop()}
                          />
                        )
                      );
                    })}
                  </SpeedDial>
                </Box>
              </MenuItem>
            );
          })}
        </Menu>
      </div>
    </div>
  );
};
