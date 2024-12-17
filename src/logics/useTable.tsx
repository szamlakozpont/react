import React, { Dispatch, SetStateAction } from 'react';
import { tableActions } from '../store/appSlices/TableSlice';
import { useAPI } from './useAPI';
import { useTranslation } from 'react-i18next';
import { useReduxDispatch } from '../store/Store';
import { AxiosError } from 'axios';
import { KeyedMutator } from 'swr';

type useTableProps = {
  apiValue: string;
};

export const useTable = ({ apiValue }: useTableProps) => {
  const { t } = useTranslation(['table']);
  const dispatch = useReduxDispatch();
  const { deleteBulkData } = useAPI(); 

  const openDeleteSelectedConfirm = async (
    table: any,

    selectedRows: any,
    setRowSelection: Dispatch<SetStateAction<any>>,
    mutate: KeyedMutator<any>,
  ) => {
    const originalRowIds = Object.keys(selectedRows).map((key) => key);
    const rows = table.getSelectedRowModel().rows;
    const rowsIdEditable = rows.map((item: any) => (item.original.nonEditable ? undefined : item.id)).filter((x: any) => x);
    const isMultiple = originalRowIds.length > 1;

    if (window.confirm(isMultiple ? t('areYouM', { ns: ['table'] }) : t('areYou', { ns: ['table'] }))) {
      try {
        if (rowsIdEditable) {
          await deleteBulkData(rowsIdEditable as string[], apiValue);
          setRowSelection({});
          mutate();
        }
      } catch (error) {
        const err = error as AxiosError;
      }
    }
  };

  const openBulkCreateModal = () => {
    dispatch(tableActions.setIsBulkCreateModalOpen(true));
  };

  return {
    openDeleteSelectedConfirm,
    openBulkCreateModal,
  };
};
