import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAPI } from '../../../logics/useAPI';
import { AxiosError } from 'axios';
import { KeyedMutator } from 'swr';
import { Button, Toolbar, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import ConfirmModal from '../ConfirmModal';
import { TopToolCustom } from './TopToolCustom';
import { DataColumnsProp } from '../../types/Table.type';
import useTextToSpeech from '../../../logics/useTextToSpeech';

type TableToolbarProps = {
  rows: any;
  visibleRows: any;
  dataColumns: DataColumnsProp[];
  columns: any[];
  numSelected: number;
  tableTitle: string | undefined;
  selectedRows: number[];
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
  mutate: KeyedMutator<any>;
  apiValue: string;
  translation: string;
  canDelete: boolean;
};

export const TableToolbar: React.FC<TableToolbarProps> = ({
  rows,
  visibleRows,
  dataColumns,
  columns,
  numSelected,
  tableTitle,
  selectedRows,
  setSelectedRows,
  mutate,
  apiValue,
  translation,
  canDelete,
}) => {
  const { t } = useTranslation(['table', translation]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const isMultipleRows = selectedRows.length > 1;
  const { deleteBulkData } = useAPI();

  const { handlePlay, handleStop } = useTextToSpeech();

  const handleOpenConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedRows([]);
  };

  const onConfirm = async () => {
    const rowsIdEditable = selectedRows.map((item) => item.toString());
    try {
      if (rowsIdEditable) {
        await deleteBulkData(rowsIdEditable as string[], apiValue);
        setSelectedRows([]);
        mutate();
      }
    } catch (error) {
      const err = error as AxiosError;
    }
  };

  return (
    <>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        <TopToolCustom rows={rows} visibleRows={visibleRows} selectedRowsIds={selectedRows} columns={columns} dataName={apiValue} dataColumns={dataColumns} />
        {numSelected > 0 && canDelete && (
          <>
            <Typography color="inherit" variant="subtitle1" component="div">
              {numSelected} {t('selected', { ns: ['table'] })}
            </Typography>

            <Button onClick={handleOpenConfirmModal} onMouseEnter={() => handlePlay(t('deleteSelected', { ns: ['table'] }))} onMouseLeave={() => handleStop()}>
              <div className="flex bg-transparent text-red-500 px-4 border border-red-500 hover:bg-red-500 hover:text-white hover:border-transparent py-0 rounded-full">
                <Delete />
                {t('selected', { ns: ['table'] })}
              </div>
            </Button>
          </>
        )}
        {tableTitle && (
          <Typography
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
            id="tableTitle"
            component="div"
          >
            {tableTitle}
          </Typography>
        )}
      </Toolbar>

      {isConfirmModalOpen && (
        <ConfirmModal
          openModal={isConfirmModalOpen}
          handleCloseModal={handleCloseConfirmModal}
          handleClose={handleCloseConfirmModal}
          handleCancel={handleCloseConfirmModal}
          onConfirmProp={onConfirm}
          modalTitle={isMultipleRows ? t('deleteTitleMultiple', { ns: [translation] }) : t('deleteTitle', { ns: [translation] })}
          contentText={isMultipleRows ? t('toDeleteMultiple', { ns: [translation] }) : t('toDelete', { ns: [translation] })}
          confirmText={t('delete', { ns: ['table'] })}
          translation={translation}
        />
      )}
    </>
  );
};
