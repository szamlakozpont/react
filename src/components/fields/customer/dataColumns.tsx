import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataColumnsProp } from '../../types/Table.type';

export const useDataColumnsCustomer = () => {
  const { t } = useTranslation(['customer']);

  const selectOptions = [{ id: '0', label: t('allCustomers', { ns: ['customer'] }) }];

  const dataColumns: DataColumnsProp[] = [
    { id: 'id', label: t('id', { ns: ['customer'] }), type: 'number' },
    { id: 'name', label: t('name', { ns: ['customer'] }), type: 'string' },
    { id: 'email', label: t('email', { ns: ['customer'] }), type: 'string' },
    { id: 'address', label: t('cityName', { ns: ['customer'] }), type: 'string' },
    { id: 'tax_number', label: t('taxNumber', { ns: ['customer'] }), type: 'string' },
    { id: 'eu_tax_number', label: t('euTaxNumber', { ns: ['customer'] }), type: 'string' },
  ];

  return { selectOptions, dataColumns };
};
