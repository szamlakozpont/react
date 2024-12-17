import React from 'react';
import { useTranslation } from 'react-i18next';
import { regExpVariables } from '../../../utils/variables';

export const useCreateCustomerFields = () => {
  const { t } = useTranslation(['customer']);

  const fields = [
    {
      label: t('baseCustomerData', { ns: ['customer'] }),
      items: [
        { name: 'name', type: 'text' },
        { name: 'email', type: 'text', pattern: regExpVariables.emailPattern },
        { name: 'cityName', type: 'text' },
        { name: 'taxNumber', type: 'text', pattern: regExpVariables.taxNumberPattern, required: false },
        { name: 'euTaxNumber', required: false, type: 'text', pattern: regExpVariables.euTaxNumberPattern },
      ],
    },
  ];

  return fields;
};
