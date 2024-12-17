import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { tableVariables } from '../../../utils/variables';
import { tableActions } from '../../../store/appSlices/TableSlice';
import { useReduxDispatch } from '../../../store/Store';
import { DataColumnsProp } from '../../types/Table.type';

export const useDataColumnsPartner = () => {
  const { t } = useTranslation(['partner']);
  const dispatch = useReduxDispatch();

  const handleClickSupplier = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, rowId: string) => {
    e.preventDefault();
    dispatch(tableActions.setRowId(rowId));
    dispatch(tableActions.setIsItemModalOpen(true));
  };

  const handleClickInvoices = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, rowId: string) => {
    e.preventDefault();
    dispatch(tableActions.setRowId(rowId));
    dispatch(tableActions.setIsInvoicesListModalOpen(true));
  };

  const selectOptions = [{ id: '0', label: t('allPartners', { ns: ['partner'] }) }];

  const dataColumns: DataColumnsProp[] = [
    { id: 'id', label: t('id', { ns: ['partner'] }), type: 'number' },
    { id: 'name', label: t('name', { ns: ['partner'] }), type: 'string' },
    { id: 'email', label: t('email', { ns: ['partner'] }), type: 'string' },
    { id: 'address', label: t('address', { ns: ['partner'] }), type: 'string' },
    { id: 'tax_number', label: t('taxNumber', { ns: ['partner'] }), type: 'string' },
    { id: 'eu_tax_number', label: t('euTaxNumber', { ns: ['partner'] }), type: 'string' },
    { id: 'is_private', label: t('isPrivate', { ns: ['partner'] }), type: 'boolean' },
    { id: 'number_of_invoices', label: t('numberOfInvoices', { ns: ['partner'] }), type: 'number' },
    {
      id: 'supplier_name',
      label: t('supplierName', { ns: ['partner'] }),
      type: 'string',
      component: (row) => {
        return (
          <Button size="small" sx={{ textTransform: 'uppercase' }} onClick={(e) => handleClickSupplier(e, row.supplier_id)}>
            <span className={`bg-transparent ${tableVariables.buttonsColorText} text-nowrap`}>{row.supplier.name}</span>
          </Button>
        );
      },
    },
    { id: 'supplier_id', label: t('supplierId', { ns: ['partner'] }), type: 'number', hidden: true },
    {
      id: 'invoices',
      label: t('invoices', { ns: ['supplier'] }),
      type: 'string',
      component: (row) => {
        if (row.number_of_invoices > 0) {
          return (
            <Button size="small" sx={{ textTransform: 'uppercase' }} onClick={(e) => handleClickInvoices(e, row.id)}>
              <span className={`bg-transparent ${tableVariables.buttonsColorText} text-nowrap`}>{t('invoicesTitle', { ns: ['partner'] })}</span>
            </Button>
          );
        } else return <></>;
      },
    },
  ];

  const dataColumnsProfile: DataColumnsProp[] = [
    { id: 'profile_name', label: t('profileName', { ns: ['partner'] }), type: 'string' },
    { id: 'e_invoice_pieces_price', label: t('eInvoicePiecesPrice', { ns: ['partner'] }), type: 'number' },
    { id: 'invoice_store_pieces_price', label: t('invoiceStorePiecesPrice', { ns: ['partner'] }), type: 'number' },
    { id: 'invoice_box_price', label: t('invoiceBoxPrice', { ns: ['partner'] }), type: 'number' },
    { id: 'nav_e_invoice_pieces_price', label: t('navEInvoicePiecesPrice', { ns: ['partner'] }), type: 'number' },
    { id: 'nav_paper_invoice_pieces_price', label: t('navPaperInvoicePiecesPrice', { ns: ['partner'] }), type: 'number' },
    { id: 'archive_price', label: t('archivePrice', { ns: ['partner'] }), type: 'number' },
  ];

  return { selectOptions, dataColumns, dataColumnsProfile };
};
