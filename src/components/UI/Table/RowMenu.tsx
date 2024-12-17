import React, { MouseEvent, useCallback, useMemo, useState } from 'react';
import { Box, SpeedDial, SpeedDialAction, Tooltip } from '@mui/material';
import { FileDownload, MoreHoriz, Print, Save } from '@mui/icons-material';
import { tableVariables } from '../../../utils/variables';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DataColumnsProp } from '../../types/Table.type';
import { useTranslation } from 'react-i18next';

type RowMenuProps = {
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

export const RowMenu: React.FC<RowMenuProps> = ({ rows, visibleRows, selectedRowsIds, columns, dataName, dataColumns }) => {
  const { t } = useTranslation(['table']);
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [openExport, setOpenExport] = useState<null | HTMLElement>(null);

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

  const speedDialActions = useMemo(
    () => [
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
    ],
    [handlePdfExportRows, rows, selectedRows, t, visibleRows],
  );

  const handleOpenSpeedDial = () => {
    setOpenSpeedDial(true);
  };

  const handleCloseSpeedDial = () => {
    setOpenSpeedDial(false);
  };

  const handleClickSpeedDialIcon = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>, funcProp: () => void) => {
    e.preventDefault();
    funcProp();
    handleCloseSpeedDial();
  };

  return (
    <div className="flex">
      <div>
        <Tooltip arrow title={t('menu', { ns: ['table'] })}>
          <span className={`bg-transparent px-[5px] pb-[5px] ${tableVariables.buttonsColorHover} hover:text-white rounded-full `}>
            <SpeedDial
              ariaLabel="SpeedDial"
              icon={
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <MoreHoriz sx={{ fontSize: 25 }} />
                </Box>
              }
              direction="right"
              onOpen={() => handleOpenSpeedDial}
              onClose={() => handleCloseSpeedDial}
              open={openSpeedDial}
              sx={{ '& .MuiFab-primary': { width: 45, height: 45, backgroundColor: 'primary', color: 'white', variant: 'extended' } }}
            >
              {speedDialActions.map((action) => {
                return (
                  action.valid() && (
                    <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} tooltipPlacement="bottom" onClick={(e) => handleClickSpeedDialIcon(e, action.funcProp)} />
                  )
                );
              })}
            </SpeedDial>
          </span>
        </Tooltip>
      </div>
    </div>
  );
};
