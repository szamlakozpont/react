import { API_SELECTLIST_INVOICENUMBERS, API_SELECTLIST_PDFSCHEMAS } from './../../../utils/variables';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReduxSelector } from '../../../store/Store';
import { useAxios } from '../../../logics/useAxios';
import { API_DATA, regExpVariables, serverPagination } from '../../../utils/variables';
import dayjs from 'dayjs';
import useSWR from 'swr';

type InvoiceModalProps = {
  setLoadingSelectList: Dispatch<SetStateAction<boolean>>;
  supplierId?: string;
};

export const useCreateInvoiceFields = ({ setLoadingSelectList, supplierId }: InvoiceModalProps) => {
  const { t } = useTranslation(['invoice']);
  const isInvoiceCreateModalOpen = useReduxSelector((state) => state.table.isInvoiceCreateModalOpen);
  const isInvoiceEditModalOpen = useReduxSelector((state) => state.table.isInvoiceEditModalOpen);
  const [selectOptionsInvoiceNumbers, setSelectOptionsInvoiceNumbers] = useState<{ [key: string]: string }>({});
  const [selectOptionsPdfSchema, setSelectOptionsPdfSchema] = useState<{ [key: string]: string }>({});

  const { apiService } = useAxios();
  const {
    data: fetchedDataInvoiceNumbers,
    error: isLoadingDataErrorInvoiceNumbers,
    isLoading: isLoadingDataInvoiceNumbers,
    isValidating: isFetchingDataInvoiceNumbers,
  } = useSWR(isInvoiceCreateModalOpen || isInvoiceEditModalOpen ? [API_DATA + `${API_SELECTLIST_INVOICENUMBERS}/${supplierId}`, 'GET', ''] : null, ([url, method, body]) =>
    apiService({ url: url, method: method, data: body }),
  );

  const {
    data: fetchedDataPdfSchema,
    error: isLoadingDataErrorPdfSchema,
    isLoading: isLoadingDataPdfSchema,
    isValidating: isFetchingDataPdfSchema,
  } = useSWR(isInvoiceCreateModalOpen || isInvoiceEditModalOpen ? [API_DATA + `${API_SELECTLIST_PDFSCHEMAS}/${supplierId}`, 'GET', ''] : null, ([url, method, body]) =>
    apiService({ url: url, method: method, data: body }),
  );

  const dataInvoiceNumbers = useMemo(() => {
    if (fetchedDataInvoiceNumbers) {
      if (!serverPagination) return fetchedDataInvoiceNumbers;
      return fetchedDataInvoiceNumbers.results;
    } else return undefined;
  }, [fetchedDataInvoiceNumbers]);

  const dataPdfSchema = useMemo(() => {
    if (fetchedDataPdfSchema) {
      if (!serverPagination) return fetchedDataPdfSchema;
      return fetchedDataPdfSchema.results;
    } else return undefined;
  }, [fetchedDataPdfSchema]);

  useEffect(() => {
    if (dataInvoiceNumbers && dataPdfSchema) {
      setSelectOptionsInvoiceNumbers(dataInvoiceNumbers);
      setSelectOptionsPdfSchema(dataPdfSchema);
      setLoadingSelectList(false);
    }
  }, [dataInvoiceNumbers, dataPdfSchema, setLoadingSelectList]);

  const invoiceLanguageSelectOptions = [
    { id: 'HU', label: t('hungarian', { ns: ['invoice'] }) },
    { id: 'EN', label: t('english', { ns: ['invoice'] }) },
  ];

  const invoiceTypeSelectOptions = [
    { id: '1', label: t('normal', { ns: ['invoice'] }) },
    { id: '2', label: t('storno', { ns: ['invoice'] }) },
    { id: '3', label: t('feeRequest', { ns: ['invoice'] }) },
    { id: '4', label: t('modify', { ns: ['invoice'] }) },
  ];

  const paymentTypeSelectOptions = [
    { id: '1', label: t('transfer', { ns: ['invoice'] }) },
    { id: '2', label: t('cash', { ns: ['invoice'] }) },
  ];

  const eInvoiceSelectOptions = [
    { id: '1', label: t('eInvoice', { ns: ['invoice'] }) },
    { id: '2', label: t('paper', { ns: ['invoice'] }) },
  ];

  const vatSelectOptions = [
    { id: '0', label: '0' },
    { id: '5', label: '5' },
    { id: '27', label: '27' },
  ];

  const fields = [
    {
      label: t('baseSupplierData', { ns: ['invoice'] }),
      items: [
        { name: 'supplierName', type: 'text', nonEditable: true },
        { name: 'supplierTaxNumber', type: 'text', nonEditable: true },
        { name: 'supplierEuTaxNumber', type: 'text', nonEditable: true, required: false },
        { name: 'supplierAddress', type: 'text', nonEditable: true },
      ],
    },
    {
      label: t('baseCustomerData', { ns: ['invoice'] }),
      items: [
        { name: 'partnerName', type: 'text' },
        { name: 'partnerEmail', type: 'text' },
        { name: 'partnerAddress', type: 'text' },
        { name: 'partnerTaxNumber', type: 'text', pattern: regExpVariables.taxNumberPattern, required: false },
        { name: 'partnerEuTaxNumber', type: 'text', pattern: regExpVariables.euTaxNumberPattern, required: false },
      ],
    },
    {
      label: t('invoiceNumberData', { ns: ['invoice'] }),
      items: [{ name: 'invoiceNumberId', type: 'select', selectOptions: selectOptionsInvoiceNumbers, selectSearch: false }],
    },
    {
      label: t('pdfSchemaData', { ns: ['invoice'] }),
      items: [
        { name: 'pdfSchemaId', type: 'select', selectOptions: selectOptionsPdfSchema, selectSearch: false },
        { name: 'language', type: 'select', selectOptions: invoiceLanguageSelectOptions, selectSearch: false },
      ],
    },
    {
      label: t('baseInvoiceData', { ns: ['invoice'] }),
      items: [
        { name: 'description', type: 'text', required: false },
        { name: 'editable', type: 'boolean', required: false },
        { name: 'eInvoice', type: 'select', selectOptions: eInvoiceSelectOptions },
        { name: 'invoiceType', type: 'select', selectOptions: invoiceTypeSelectOptions },
        { name: 'paymentType', type: 'select', selectOptions: paymentTypeSelectOptions },
        { name: 'issueDate', type: 'date', default: dayjs() },
        { name: 'completionDate', type: 'date', default: dayjs() },
        { name: 'paymentTermDate', type: 'date', default: dayjs() },
      ],
    },
  ];

  const jsonFields = [
    {
      items: [
        { name: 'itemNumber', type: 'text' },
        { name: 'productCode', type: 'text' },
        { name: 'productName', type: 'text' },
        { name: 'quantity', type: 'numeric' },
        { name: 'netUnitPrice', type: 'currency' },
        { name: 'grossUnitPrice', type: 'currency', required: false, disabled: true },
        { name: 'vatKey', type: 'select', selectOptions: vatSelectOptions, default: '27' },
        { name: 'netPrice', type: 'currency', disabled: true },
        { name: 'vatValue', type: 'currency', required: false, disabled: true },
        { name: 'grossPrice', type: 'currency', required: false, disabled: true },
      ],
    },
  ];

  const sumFields = [
    {
      items: [
        { name: 'sumVatBase0', type: 'text', required: false },
        { name: 'sumVatBase5', type: 'text', required: false },
        { name: 'sumVatBase27', type: 'text', required: false },
        { name: 'sumVatValue0', type: 'text', required: false },
        { name: 'sumVatValue5', type: 'text', required: false },
        { name: 'sumVatValue27', type: 'text', required: false },
        { name: 'sumGross0', type: 'text', required: false },
        { name: 'sumGross5', type: 'text', required: false },
        { name: 'sumGross27', type: 'text', required: false },
        { name: 'netTotal', type: 'text', required: false },
        { name: 'grossTotal', type: 'text', required: false },
        { name: 'vatTotal', type: 'text', required: false },
        { name: 'rounding', type: 'text', required: false },
        { name: 'grossTotalText', type: 'text', required: false },
      ],
    },
  ];
  return { fields, jsonFields, sumFields };
};
