import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@mui/material';
import { tableVariables } from '../../../utils/variables';
import { useReduxDispatch } from '../../../store/Store';
import { tableActions } from '../../../store/appSlices/TableSlice';
import { DataColumnsProp } from '../../types/Table.type';

export const useDataColumnsSupplier = () => {
  const { t } = useTranslation(['supplier', 'partner']);
  const dispatch = useReduxDispatch();

  const handleClickPartners = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, rowId: string) => {
    e.preventDefault();
    dispatch(tableActions.setRowId(rowId));
    dispatch(tableActions.setIsPartnersListModalOpen(true));
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, rowId: string) => {
    e.preventDefault();
    dispatch(tableActions.setRowId(rowId));
    dispatch(tableActions.setIsInvoiceNumbersListModalOpen(true));
  };

  const selectOptions = [{ id: '0', label: t('allSuppliers', { ns: ['supplier'] }) }];

  const dataColumns: DataColumnsProp[] = [
    { id: 'id', label: t('id', { ns: ['supplier'] }), type: 'number' },
    { id: 'name', label: t('name', { ns: ['supplier'] }), type: 'string' },
    { id: 'address', label: t('address', { ns: ['supplier'] }), type: 'string' },
    { id: 'email', label: t('email', { ns: ['supplier'] }), type: 'string' },
    { id: 'tax_number', label: t('taxNumber', { ns: ['supplier'] }), type: 'string' },
    { id: 'eu_tax_number', label: t('euTaxNumber', { ns: ['supplier'] }), type: 'string' },
    {
      id: 'supplier_partner',
      label: t('supplierPartner_', { ns: ['supplier'] }),
      type: 'string',
      component: (row) => {
        return (
          <Button size="small" sx={{ textTransform: 'capitalize' }} onClick={(e) => handleClickPartners(e, row.id.toString())}>
            <span className={`bg-transparent ${tableVariables.buttonsColorText}`}>{t('supplierPartner_', { ns: ['supplier'] }).toUpperCase()}</span>
          </Button>
        );
      },
    },
    // {
    //   id: 'supplier_invoicenumber',
    //   label: t('supplierInvoiceNumber', { ns: ['supplier'] }),
    //   type: 'string',
    //   component: (row) => {
    //     return (
    //       <Button size="small" sx={{ textTransform: 'capitalize' }} onClick={(e) => handleClick(e, row.id.toString())}>
    //         <span className={`bg-transparent ${tableVariables.buttonsColorText} text-nowrap`}>{t('invoiceNumbers', { ns: ['supplier'] }).toUpperCase()}</span>
    //       </Button>
    //     );
    //   },
    // },
    { id: 'number_of_invoices', label: t('numberOfInvoices', { ns: ['supplier'] }), type: 'number' },
    { id: 'code', label: t('code', { ns: ['supplier'] }), type: 'string' },
  ];

  return { selectOptions, dataColumns };
};
