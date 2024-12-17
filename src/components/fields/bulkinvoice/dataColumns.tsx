import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataColumnsProp } from '../../types/Table.type';

export const useDataColumnsBulkInvoice = () => {
  const { t } = useTranslation(['bulkinvoice']);

  const csvColumns: DataColumnsProp[] = [
    { id: 'partner_id', label: t('partnerId', { ns: ['bulkinvoice'] }), type: 'number' },
    { id: 'partner_name', label: t('partnerName', { ns: ['bulkinvoice'] }), type: 'number' },
    { id: 'e_invoice_pieces', label: t('eInvoicePieces', { ns: ['bulkinvoice'] }), type: 'number' },
    { id: 'e_invoice_pieces_price', label: t('eInvoicePiecesPrice', { ns: ['bulkinvoice'] }), type: 'number' },
    { id: 'invoice_store_pieces', label: t('invoiceStorePieces', { ns: ['bulkinvoice'] }), type: 'number' },
    { id: 'invoice_store_pieces_price', label: t('invoiceStorePiecesPrice', { ns: ['bulkinvoice'] }), type: 'number' },
    { id: 'nav_e_invoice_pieces', label: t('navEInvoicePieces', { ns: ['bulkinvoice'] }), type: 'number' },
    { id: 'nav_e_invoice_pieces_price', label: t('navEInvoicePiecesPrice', { ns: ['bulkinvoice'] }), type: 'number' },
    { id: 'nav_paper_invoice_pieces', label: t('navPaperInvoicePieces', { ns: ['bulkinvoice'] }), type: 'number' },
    { id: 'nav_paper_invoice_pieces_price', label: t('navPaperInvoicePiecesPrice', { ns: ['bulkinvoice'] }), type: 'number' },
    { id: 'invoice_box', label: t('invoiceBox', { ns: ['bulkinvoice'] }), type: 'number' },
    { id: 'invoice_box_price', label: t('invoiceBoxPrice', { ns: ['bulkinvoice'] }), type: 'number' },
    { id: 'archive', label: t('archive', { ns: ['bulkinvoice'] }), type: 'number' },
    { id: 'archive_price', label: t('archivePrice', { ns: ['bulkinvoice'] }), type: 'number' },
  ];

  return { csvColumns };
};
