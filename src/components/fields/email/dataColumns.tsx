import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataColumnsProp } from '../../types/Table.type';
import { tableVariables } from '../../../utils/variables';
import { useReduxDispatch } from '../../../store/Store';
import { tableActions } from '../../../store/appSlices/TableSlice';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Button } from '@mui/material';
dayjs.extend(utc);

export const useDataColumnsEmail = () => {
  const { t, i18n } = useTranslation(['email']);
  const dispatch = useReduxDispatch();

  const handleClickJson = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: any, modal: string) => {
    e.preventDefault();
    dispatch(tableActions.setRowCustom(data));

    switch (modal) {
      // case 'sent_log': {
      //   dispatch(tableActions.setIsEmailSentLogJsonListModalOpen(true));
      //   break;
      // }
      // case 'error_log': {
      //   dispatch(tableActions.setIsEmailErrorLogJsonListModalOpen(true));
      //   break;
      // }
      case 'login': {
        dispatch(tableActions.setIsEmailLoginJsonListModalOpen(true));
        break;
      }
      case 'data': {
        dispatch(tableActions.setIsEmailDataJsonListModalOpen(true));
        break;
      }
      default: {
        return false;
      }
    }
  };

  const dataColumns: DataColumnsProp[] = [
    { id: 'id', label: t('id', { ns: ['email'] }), type: 'number' },
    { id: 'sender', label: t('sender', { ns: ['email'] }), type: 'string' },
    { id: 'recipient', label: t('recipient', { ns: ['email'] }), type: 'string' },
    { id: 'text', label: t('text', { ns: ['email'] }), type: 'string' },
    {
      id: 'invoice_created_at',
      label: t('createdAt', { ns: ['email'] }),
      type: 'date',
      component: (row) => {
        if (row.invoice_created_at) {
          return (
            <span>{i18n.language === 'hu' ? dayjs.utc(row.invoice_created_at).format('YYYY-MM-DD HH:mm:ss.SSS Z[Z]') : dayjs.utc(row.invoice_created_at).format('DD/MM/YYYY HH:mm:ss.SSS Z[Z]')}</span>
          );
        } else {
          return <></>;
        }
      },
    },
    { id: 'is_received', label: t('isReceived', { ns: ['email'] }), type: 'boolean' },
    {
      id: 'received_at',
      label: t('receivedAt', { ns: ['email'] }),
      type: 'date',
      component: (row) => {
        if (row.received_at) {
          return <span>{i18n.language === 'hu' ? dayjs.utc(row.received_at).format('YYYY-MM-DD HH:mm:ss.SSS Z[Z]') : dayjs.utc(row.received_at).format('DD/MM/YYYY HH:mm:ss.SSS Z[Z]')}</span>;
        } else {
          return <></>;
        }
      },
    },
    {
      id: 'sent_log',
      label: t('sentLog', { ns: ['email'] }),
      type: 'string',
    },
    {
      id: 'sent_at',
      label: t('sentAt', { ns: ['email'] }),
      type: 'date',
      component: (row) => {
        if (row.sent_at) {
          return <span>{i18n.language === 'hu' ? dayjs.utc(row.sent_at).format('YYYY-MM-DD HH:mm:ss.SSS Z[Z]') : dayjs.utc(row.sent_at).format('DD/MM/YYYY HH:mm:ss.SSS Z[Z]')}</span>;
        } else {
          return <></>;
        }
      },
    },
    {
      id: 'error_log',
      label: t('errorLog', { ns: ['email'] }),
      type: 'string',
    },
    {
      id: 'error_at',
      label: t('errorAt', { ns: ['email'] }),
      type: 'date',
      component: (row) => {
        if (row.error_at) {
          return <span>{i18n.language === 'hu' ? dayjs.utc(row.error_at).format('YYYY-MM-DD HH:mm:ss.SSS Z[Z]') : dayjs.utc(row.error_at).format('DD/MM/YYYY HH:mm:ss.SSS Z[Z]')}</span>;
        } else {
          return <></>;
        }
      },
    },
    { id: 'code', label: t('code', { ns: ['email'] }), type: 'string' },
    { id: 'pin', label: t('pin', { ns: ['email'] }), type: 'string' },
    { id: 'pin_input_count', label: t('pinInputCount', { ns: ['email'] }), type: 'number' },
    {
      id: 'login',
      label: t('login', { ns: ['email'] }),
      type: 'string',
      component: (row) => {
        if (row.login) {
          return (
            <Button size="small" sx={{ textTransform: 'uppercase' }} onClick={(e) => handleClickJson(e, row.login, 'login')}>
              <span className={`bg-transparent ${tableVariables.buttonsColorText} text-nowrap`}>{t('login', { ns: ['email'] })}</span>
            </Button>
          );
        } else {
          return <></>;
        }
      },
    },
    { id: 'sending_duration', label: t('sendingDuration', { ns: ['email'] }), type: 'number' },
    {
      id: 'data',
      label: t('data', { ns: ['email'] }),
      type: 'string',
      component: (row) => {
        if (row.data) {
          return (
            <Button size="small" sx={{ textTransform: 'uppercase' }} onClick={(e) => handleClickJson(e, row.data, 'data')}>
              <span className={`bg-transparent ${tableVariables.buttonsColorText} text-nowrap`}>{t('data', { ns: ['email'] })}</span>
            </Button>
          );
        } else {
          return <></>;
        }
      },
    },
    { id: 'message_id', label: t('messageId', { ns: ['email'] }), type: 'string' },
  ];

  const dataColumnsLogin: DataColumnsProp[] = [
    { id: 'pin_success', label: t('pinSuccess', { ns: ['email'] }), type: 'boolean' },
    {
      id: 'pin_input_at',
      label: t('pinInputAt', { ns: ['email'] }),
      type: 'date',
      component: (row) => {
        if (row.pin_input_at) {
          return <span>{i18n.language === 'hu' ? dayjs.utc(row.pin_input_at).format('YYYY-MM-DD HH:mm:ss.SSS Z[Z]') : dayjs.utc(row.pin_input_at).format('DD/MM/YYYY HH:mm:ss.SSS Z[Z]')}</span>;
        } else {
          return <></>;
        }
      },
    },
  ];

  const dataColumnsData: DataColumnsProp[] = [
    { id: 'currency', label: t('dataCurrency', { ns: ['email'] }), type: 'string' },
    { id: 'language', label: t('dataLanguage', { ns: ['email'] }), type: 'string' },
    { id: 'invoiceSum', label: t('dataInvoiceSum', { ns: ['email'] }), type: 'string' },
    { id: 'isSEndEmail', label: t('dataIsSendEmail', { ns: ['email'] }), type: 'string' },
    { id: 'partnerName', label: t('dataPartnerName', { ns: ['email'] }), type: 'string' },
    { id: 'partnerEmail', label: t('dataPartnerEmail', { ns: ['email'] }), type: 'string' },
    { id: 'supplierName', label: t('dataSupplierName', { ns: ['email'] }), type: 'string' },
    { id: 'invoiceNumber', label: t('dataInvoiceNumber', { ns: ['email'] }), type: 'string' },
    { id: 'supplierEmail', label: t('dataSupplierEmail', { ns: ['email'] }), type: 'string' },
    { id: 'invoicePaymentTermDate', label: t('dataInvoicePaymentTermDate', { ns: ['email'] }), type: 'string' },
  ];
  return { dataColumns, dataColumnsLogin, dataColumnsData };
};
