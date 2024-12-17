import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataColumnsProp } from '../../types/Table.type';
import { Button } from '@mui/material';
import { API_ATTACHMENT_FILEVIEW, API_DATA, API_PDF_FILEVIEW } from '../../../utils/variables';
import { useReduxDispatch } from '../../../store/Store';
import { tableActions } from '../../../store/appSlices/TableSlice';
import { useAxios } from '../../../logics/useAxios';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import BrushIcon from '@mui/icons-material/Brush';
import SaveIcon from '@mui/icons-material/Save';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

export const useDataColumnsInvoice = () => {
  const { t, i18n } = useTranslation(['invoice']);
  const dispatch = useReduxDispatch();
  const { apiService } = useAxios();

  const handleClickData = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: any) => {
    e.preventDefault();
    dispatch(tableActions.setRowCustom(data));
    dispatch(tableActions.setIsInvoiceJsonListModalOpen(true));
  };

  const handleClickPdf = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, rowId: any) => {
    e.preventDefault();
    try {
      const response = await apiService({ url: API_DATA + `${API_PDF_FILEVIEW}/${rowId}`, method: 'GET', data: undefined, responseType: 'blob' });
      const blob = new Blob([response], {
        type: 'application/pdf',
      });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl);
    } catch (error) {
      const err = error as AxiosError;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const handleClickRecipients = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, recipients: any) => {
    e.preventDefault();
    dispatch(tableActions.setRowCustom(recipients));
    dispatch(tableActions.setIsInvoiceRecipientsListModalOpen(true));
  };

  const handleClickAttachmentsList = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, attachments: any) => {
    e.preventDefault();
    dispatch(tableActions.setRowCustom(attachments));
    dispatch(tableActions.setIsInvoiceAttachmentsListModalOpen(true));
  };

  const handleClickAttachmentFile = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, rowId: any, file: string) => {
    e.preventDefault();
    try {
      const index = file.lastIndexOf('/');
      const fileName = file.substring(index + 1);
      const response = await apiService({ url: API_DATA + `${API_ATTACHMENT_FILEVIEW}/${rowId}`, method: 'GET', data: undefined, responseType: 'blob' });
      const blob = new Blob([response], {
        type: 'application/octet-stream',
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // link.remove();
    } catch (error) {
      const err = error as AxiosError;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const handleClickSignatures = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, signatureInformation: any) => {
    e.preventDefault();
    dispatch(tableActions.setRowCustom_(signatureInformation));
    dispatch(tableActions.setIsInvoiceAttachmentSignatureListModalOpen(true));
  };

  const selectOptions = [
    { id: '0', label: t('allInvoices', { ns: ['invoice'] }) },
    { id: '1', label: t('outgoingInvoices', { ns: ['invoice'] }) },
    { id: '2', label: t('incomingInvoices', { ns: ['invoice'] }) },
    { id: '3', label: t('asideInvoices', { ns: ['invoice'] }) },
  ];

  const dataColumns: DataColumnsProp[] = [
    { id: 'id', label: t('id', { ns: ['invoice'] }), type: 'number' },
    { id: 'invoice_number', label: t('invoiceNumber', { ns: ['invoice'] }), type: 'number' },
    { id: 'code', label: t('code', { ns: ['invoice'] }), type: 'string' },
    { id: 'description', label: t('description', { ns: ['invoice'] }), type: 'string' },
    { id: 'supplier_name', label: t('supplierName', { ns: ['invoice'] }), type: 'string' },
    { id: 'supplier_tax_number', label: t('supplierTaxNumber', { ns: ['invoice'] }), type: 'string' },
    { id: 'supplier_eu_tax_number', label: t('supplierEuTaxNumber', { ns: ['invoice'] }), type: 'string' },
    { id: 'supplier_address', label: t('supplierAddress', { ns: ['invoice'] }), type: 'string' },
    { id: 'partner_name', label: t('partnerName', { ns: ['invoice'] }), type: 'string' },
    { id: 'partner_email', label: t('partnerEmail', { ns: ['invoice'] }), type: 'string' },
    { id: 'partner_address', label: t('partnerAddress', { ns: ['invoice'] }), type: 'string' },
    { id: 'partner_tax_number', label: t('partnerTaxNumber', { ns: ['invoice'] }), type: 'string' },
    { id: 'partner_eu_tax_number', label: t('partnerEuTaxNumber', { ns: ['invoice'] }), type: 'string' },
    {
      id: 'data',
      label: t('data', { ns: ['invoice'] }),
      type: 'string',
      component: (row) => {
        if (row.items.data) {
          return (
            <Button size="small" sx={{ textTransform: 'uppercase' }} onClick={(e) => handleClickData(e, row.items.data)}>
              {/* <span className={`bg-transparent ${tableVariables.buttonsColorText} text-nowrap`}>{t('data', { ns: ['invoice'] })}</span> */}
              <BlurOnIcon />
            </Button>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      id: 'pdf',
      label: t('pdf', { ns: ['invoice'] }),
      type: 'string',
      component: (row) => {
        if (row.id) {
          return (
            <Button size="small" sx={{ textTransform: 'uppercase' }} onClick={(e) => handleClickPdf(e, row.id)}>
              <PictureAsPdfIcon />
            </Button>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      id: 'attachments',
      label: t('attachments', { ns: ['invoice'] }),
      type: 'string',
      component: (row) => {
        if (row.attachments.length > 0) {
          return (
            <Button size="small" sx={{ textTransform: 'uppercase' }} onClick={(e) => handleClickAttachmentsList(e, row.attachments)}>
              <AttachFileIcon />
            </Button>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      id: 'recipients',
      label: t('recipients', { ns: ['invoice'] }),
      type: 'string',
      component: (row) => {
        if (row.recipients && row.recipients.length > 0) {
          return (
            <Button size="small" sx={{ textTransform: 'uppercase' }} onClick={(e) => handleClickRecipients(e, row.recipients)}>
              <AlternateEmailIcon />
              {/* <span className={`bg-transparent  ${tableVariables.buttonsColorText} text-nowrap`}>{t('recipients', { ns: ['invoice'] })}</span> */}
            </Button>
          );
        } else {
          return <></>;
        }
      },
    },
    { id: 'language', label: t('language', { ns: ['invoice'] }), type: 'string' },
    { id: 'currency', label: t('currency', { ns: ['invoice'] }), type: 'string' },
    { id: 'exchange_rate', label: t('exchangeRate', { ns: ['invoice'] }), type: 'string' },
    { id: 'language', label: t('language', { ns: ['invoice'] }), type: 'string' },
    { id: 'is_editable', label: t('editable', { ns: ['invoice'] }), type: 'boolean' },
    { id: 'is_paid', label: t('paid', { ns: ['invoice'] }), type: 'boolean' },
    {
      id: 'is_einvoice',
      label: t('eInvoice', { ns: ['invoice'] }),
      type: 'select',
      component: (row) => {
        return row.is_einvoice ? <span>{t('eInvoice', { ns: ['invoice'] })}</span> : <span>{t('paper', { ns: ['invoice'] })}</span>;
      },
    },
    {
      id: 'invoice_type',
      label: t('invoiceType', { ns: ['invoice'] }),
      type: 'select',
      component: (row) => {
        if (row.invoice_type) {
          return row.invoice_type === 1 ? (
            <span>{t('normal', { ns: ['invoice'] })}</span>
          ) : row.invoice_type === 2 ? (
            <span>{t('storno', { ns: ['invoice'] })}</span>
          ) : row.invoice_type === 3 ? (
            <span>{t('feeRequest', { ns: ['invoice'] })}</span>
          ) : (
            <span>{t('modify', { ns: ['invoice'] })}</span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      id: 'payment_type',
      label: t('paymentType', { ns: ['invoice'] }),
      type: 'select',
      component: (row) => {
        if (row.payment_type) {
          return row.payment_type === 1 ? <span>{t('transfer', { ns: ['invoice'] })}</span> : <span>{t('cash', { ns: ['invoice'] })}</span>;
        } else {
          return <></>;
        }
      },
    },
    {
      id: 'issue_date',
      label: t('issueDate', { ns: ['invoice'] }),
      type: 'date',
      component: (row) => {
        if (row.issue_date) {
          return <span>{row.issue_date ? (i18n.language === 'hu' ? dayjs(row.issue_date).format('YYYY-MM-DD') : dayjs(row.issue_date).format('DD/MM/YYYY')) : ''}</span>;
        } else {
          return <></>;
        }
      },
    },
    {
      id: 'completion_date',
      label: t('completionDate', { ns: ['invoice'] }),
      type: 'date',
      component: (row) => {
        if (row.completion_date) {
          return <span>{row.completion_date ? (i18n.language === 'hu' ? dayjs(row.completion_date).format('YYYY-MM-DD') : dayjs(row.completion_date).format('DD/MM/YYYY')) : ''}</span>;
        } else {
          return <></>;
        }
      },
    },
    {
      id: 'payment_term_date',
      label: t('paymentTermDate', { ns: ['invoice'] }),
      type: 'date',
      component: (row) => {
        if (row.payment_term_date) {
          return <span>{row.payment_term_date ? (i18n.language === 'hu' ? dayjs(row.payment_term_date).format('YYYY-MM-DD') : dayjs(row.payment_term_date).format('DD/MM/YYYY')) : ''}</span>;
        } else {
          return <></>;
        }
      },
    },
    {
      id: 'created_at',
      label: t('createdAt', { ns: ['invoice'] }),
      type: 'date',
      component: (row) => {
        if (row.created_at) {
          return <span>{i18n.language === 'hu' ? dayjs.utc(row.created_at).format('YYYY-MM-DD HH:mm:ss.SSS Z[Z]') : dayjs.utc(row.created_at).format('DD/MM/YYYY HH:mm:ss.SSS Z[Z]')}</span>;
        } else {
          return <></>;
        }
      },
    },
    {
      id: 'email_received_at',
      label: t('receivedAt', { ns: ['invoice'] }),
      type: 'date',
      component: (row) => {
        if (row.email_received_at) {
          return (
            <span>{i18n.language === 'hu' ? dayjs.utc(row.email_received_at).format('YYYY-MM-DD HH:mm:ss.SSS Z[Z]') : dayjs.utc(row.email_received_at).format('DD/MM/YYYY HH:mm:ss.SSS Z[Z]')}</span>
          );
        } else {
          return <></>;
        }
      },
    },

    { id: 'guid', label: t('guid', { ns: ['invoice'] }), type: 'string' },
  ];

  const dataColumnsJson: DataColumnsProp[] = [
    { id: 'item_number', label: t('itemNumber', { ns: ['invoice'] }), type: 'string' },
    { id: 'product_code', label: t('productCode', { ns: ['invoice'] }), type: 'string' },
    { id: 'product_name', label: t('productName', { ns: ['invoice'] }), type: 'string' },
    { id: 'quantity', label: t('quantity', { ns: ['invoice'] }), type: 'number' },
    { id: 'net_unit_price', label: t('netUnitPrice', { ns: ['invoice'] }), type: 'number' },
    { id: 'gross_unit_price', label: t('grossUnitPrice', { ns: ['invoice'] }), type: 'number' },
    { id: 'net_price', label: t('netPrice', { ns: ['invoice'] }), type: 'number' },
    { id: 'gross_price', label: t('grossPrice', { ns: ['invoice'] }), type: 'number' },
    { id: 'vat_key', label: t('vatKey', { ns: ['invoice'] }), type: 'string' },
    { id: 'vat_value', label: t('vatValue', { ns: ['invoice'] }), type: 'number' },
  ];

  const dataColumnsSums: DataColumnsProp[] = [
    { id: 'id', label: t('id', { ns: ['invoice'] }), type: 'string' },
    { id: 'sum_vat_base0', label: t('sumVatBase0', { ns: ['invoice'] }), type: 'number' },
    { id: 'sum_vat_base5', label: t('sumVatBase5', { ns: ['invoice'] }), type: 'number' },
    { id: 'sum_vat_base27', label: t('sumVatBase27', { ns: ['invoice'] }), type: 'number' },
    { id: 'sum_vat_value0', label: t('sumVatValue0', { ns: ['invoice'] }), type: 'number' },
    { id: 'sum_vat_value5', label: t('sumVatValue5', { ns: ['invoice'] }), type: 'number' },
    { id: 'sum_vat_value27', label: t('sumVatValue27', { ns: ['invoice'] }), type: 'number' },
    { id: 'sum_gross0', label: t('sumGross0', { ns: ['invoice'] }), type: 'number' },
    { id: 'sum_gross5', label: t('sumGross5', { ns: ['invoice'] }), type: 'number' },
    { id: 'sum_gross27', label: t('sumGross27', { ns: ['invoice'] }), type: 'number' },
    { id: 'net_total', label: t('netTotal', { ns: ['invoice'] }), type: 'number' },
    { id: 'gross_total', label: t('grossTotal', { ns: ['invoice'] }), type: 'number' },
    { id: 'vat_total', label: t('vatTotal', { ns: ['invoice'] }), type: 'number' },
    { id: 'rounding', label: t('rounding', { ns: ['invoice'] }), type: 'number' },
    { id: 'gross_total_text', label: t('grossTotalText', { ns: ['invoice'] }), type: 'number' },
  ];

  const dataColumnsRecipients: DataColumnsProp[] = [
    { id: 'email', label: t('email', { ns: ['invoice'] }), type: 'string' },
    { id: 'is_received', label: t('isReceived', { ns: ['invoice'] }), type: 'boolean' },
    {
      id: 'type',
      label: t('recipientType', { ns: ['invoice'] }),
      type: 'string',
      component: (row) => {
        if (row.type) {
          return row.type === 'other' ? <span>{t('otherType', { ns: ['invoice'] })}</span> : <span>{t('customerType', { ns: ['invoice'] })}</span>;
        } else {
          return <></>;
        }
      },
    },
  ];

  const dataColumnsAttachments: DataColumnsProp[] = [
    { id: 'id', label: t('id', { ns: ['invoice'] }), type: 'string' },
    { id: 'attachment_file', label: t('attachmentFile', { ns: ['invoice'] }), type: 'string' },
    {
      id: 'viewFile',
      label: t('viewFile', { ns: ['invoice'] }),
      type: 'string',
      component: (row) => {
        if (row.attachment_file) {
          return (
            <Button size="small" sx={{ textTransform: 'uppercase' }} onClick={(e) => handleClickAttachmentFile(e, row.id, row.attachment_file)}>
              <SaveIcon />
            </Button>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      id: 'signature_information',
      label: t('signatureInformation', { ns: ['invoice'] }),
      type: 'string',
      component: (row) => {
        if (row.signature_information && row.signature_information.length > 0) {
          return (
            <Button size="small" sx={{ textTransform: 'uppercase' }} onClick={(e) => handleClickSignatures(e, row.signature_information)}>
              <BrushIcon />
            </Button>
          );
        } else {
          return <></>;
        }
      },
    },
    { id: 'guid', label: t('guid', { ns: ['invoice'] }), type: 'string' },
  ];

  const dataColumnsSignatureInfo: DataColumnsProp[] = [
    { id: 'signatureIntegrity', label: t('signatureIntegrity', { ns: ['invoice'] }), type: 'string' },
    { id: 'signatureExpiration', label: t('signatureExpiration', { ns: ['invoice'] }), type: 'date' },
    { id: 'signatureOrganization', label: t('signatureOrganization', { ns: ['invoice'] }), type: 'string' },
  ];

  return { selectOptions, dataColumns, dataColumnsJson, dataColumnsSums, dataColumnsRecipients, dataColumnsAttachments, dataColumnsSignatureInfo };
};
