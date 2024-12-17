import React from 'react';
import { useTranslation } from 'react-i18next';
import { regExpVariables } from '../../../utils/variables';

export const useCreateBulkInvoiceFields = () => {
  const { t } = useTranslation(['bulkinvoice']);

  const fields = [
    {
      label: t('basePartnerData', { ns: ['bulkinvoice'] }),
      items: [
        { name: 'partnerName', type: 'text' },
        { name: 'partnerEmail', type: 'text' },
        { name: 'partnerAddress', type: 'text' },
        { name: 'partnerTaxNumber', type: 'text', pattern: regExpVariables.taxNumberPattern, required: false },
        { name: 'partnerEuTaxNumber', type: 'text', pattern: regExpVariables.euTaxNumberPattern, required: false },
      ],
    },
    {
      label: t('baseQuantitiesData', { ns: ['bulkinvoice'] }),
      items: [
        { name: 'eInvoicePieces', type: 'number' },
        { name: 'invoiceBox', type: 'number' },
        { name: 'invoiceStorePieces', type: 'number' },
        { name: 'navEInvoicePieces', type: 'number' },
        { name: 'navPaperInvoicePieces', type: 'number' },
        { name: 'archive', type: 'number' },
      ],
    },
    {
      label: t('basePricesData', { ns: ['bulkinvoice'] }),
      items: [
        { name: 'eInvoicePiecesPrice', type: 'number' },
        { name: 'invoiceBoxPrice', type: 'number' },
        { name: 'invoiceStorePiecesPrice', type: 'number' },
        { name: 'navEInvoicePiecesPrice', type: 'number' },
        { name: 'navPaperInvoicePiecesPrice', type: 'number' },
        { name: 'archivePrice', type: 'number' },
      ],
    },
  ];

  return { fields };
};
