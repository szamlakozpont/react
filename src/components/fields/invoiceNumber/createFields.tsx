import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReduxSelector } from '../../../store/Store';
import { useAxios } from '../../../logics/useAxios';
import { API_DATA, API_SELECTLIST_SUPPLIERS, serverPagination } from '../../../utils/variables';
import useSWRImmutable from 'swr/immutable';

export const useCreateInvoiceNumbersFields = (setLoadingSelectList: Dispatch<SetStateAction<boolean>>) => {
  const { t } = useTranslation(['supplier']);
  const isInvoiceNumberCreateModalOpen = useReduxSelector((state) => state.table.isInvoiceNumberCreateModalOpen);
  const isInvoiceNumberEditModalOpen = useReduxSelector((state) => state.table.isInvoiceNumberEditModalOpen);
  const [selectOptions, setSelectOptions] = useState<{ [key: string]: string }>({});

  const { apiService } = useAxios();

  const {
    data: fetchedData,
    error: isLoadingDataError,
    isLoading: isLoadingData,
    isValidating: isFetchingData,
  } = useSWRImmutable(isInvoiceNumberCreateModalOpen || isInvoiceNumberEditModalOpen ? [API_DATA + API_SELECTLIST_SUPPLIERS, 'GET', ''] : null, ([url, method, body]) =>
    apiService({ url: url, method: method, data: body }),
  );

  const data = useMemo(() => {
    if (fetchedData) {
      if (!serverPagination) return fetchedData;
      return fetchedData.results;
    } else return undefined;
  }, [fetchedData]);

  useEffect(() => {
    if (data) {
      setSelectOptions(data);
      setLoadingSelectList(false);
    }
  }, [data, setLoadingSelectList]);

  const fields = [
    {
      label: t('baseInvoiceNumberData', { ns: ['supplier'] }),
      items: [
        { name: 'invoiceNumberName', type: 'text' },
        { name: 'invoiceNumberText', required: false, type: 'text' },
        { name: 'isYear', required: false, type: 'boolean', default: true },
        { name: 'fillWithZeroLength', required: false, type: 'number', default: 7 },
        { name: 'lastInvoiceNumber', required: false, type: 'text', disabled: true },
        { name: 'supplierId', type: 'select', selectOptions: selectOptions, selectSearch: false },
      ],
    },
  ];

  return fields;
};
