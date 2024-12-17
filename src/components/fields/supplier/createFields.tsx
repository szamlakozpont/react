import React from 'react';
import { regExpVariables } from '../../../utils/variables';
import { useTranslation } from 'react-i18next';

export const useCreateSupplierFields = () => {
  const { t } = useTranslation(['supplier']);

  const fields = [
    {
      label: t('baseSupplierData', { ns: ['supplier'] }),
      items: [
        { name: 'name', type: 'text' },
        { name: 'address', type: 'text' },
        { name: 'taxNumber', type: 'text', pattern: regExpVariables.taxNumberPattern },
        { name: 'euTaxNumber', required: false, type: 'text', pattern: regExpVariables.euTaxNumberPattern },
        { name: 'email', type: 'text', pattern: regExpVariables.emailPattern },
      ],
    },
  ];
  return fields;
};
