import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataColumnsProp } from '../../types/Table.type';
import { Button } from '@mui/material';
import { useReduxDispatch } from '../../../store/Store';
import { tableActions } from '../../../store/appSlices/TableSlice';
import { tableVariables } from '../../../utils/variables';

export const useDataColumnsInvoiceNumber = () => {
  const { t } = useTranslation(['supplier']);
  const dispatch = useReduxDispatch();

  const handleClickSupplier = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, rowId: string) => {
    e.preventDefault();
    dispatch(tableActions.setRowId(rowId));
    dispatch(tableActions.setIsItemModalOpen(true));
  };

  const dataColumns: DataColumnsProp[] = [
    { id: 'id', label: t('id', { ns: ['supplier'] }), type: 'number' },
    { id: 'invoice_number_name', label: t('invoiceNumberName', { ns: ['supplier'] }), type: 'string' },
    { id: 'invoice_number_text', label: t('invoiceNumberText', { ns: ['supplier'] }), type: 'string' },
    { id: 'is_year', label: t('isYear', { ns: ['supplier'] }), type: 'boolean' },
    { id: 'fill_with_zero_length', label: t('fillWithZeroLength', { ns: ['supplier'] }), type: 'number' },
    { id: 'last_invoice_number', label: t('lastInvoiceNumber', { ns: ['supplier'] }), type: 'string' },
    {
      id: 'supplier_name',
      label: t('supplierName', { ns: ['supplier'] }),
      type: 'string',
      component: (row) => {
        return (
          <Button size="small" sx={{ textTransform: 'uppercase' }} onClick={(e) => handleClickSupplier(e, row.supplier_id)}>
            <span className={`bg-transparent ${tableVariables.buttonsColorText}`}>{row.supplier_name}</span>
          </Button>
        );
      },
    },
    { id: 'supplier_id', label: t('supplierId', { ns: ['partner'] }), type: 'number', hidden: true },
  ];

  return { dataColumns };
};
