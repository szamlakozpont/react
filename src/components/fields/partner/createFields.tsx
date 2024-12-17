import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { API_DATA, API_SELECTLIST_SUPPLIERS, regExpVariables, serverPagination } from '../../../utils/variables';
import { useTranslation } from 'react-i18next';
import { useReduxSelector } from '../../../store/Store';
import { useAxios } from '../../../logics/useAxios';
import useSWRImmutable from 'swr/immutable';

export const useCreatePartnerFields = (setLoadingSelectList: Dispatch<SetStateAction<boolean>>) => {
  const { t } = useTranslation(['partner']);
  const isPartnerCreateModalOpen = useReduxSelector((state) => state.table.isPartnerCreateModalOpen);
  const isPartnerEditModalOpen = useReduxSelector((state) => state.table.isPartnerEditModalOpen);
  const [selectOptions, setSelectOptions] = useState<{ [key: string]: string }>({});

  const { apiService } = useAxios();

  const {
    data: fetchedDataSuppliers,
    error: isLoadingDataErrorSuppliers,
    isLoading: isLoadingDataSupplier,
    isValidating: isFetchingDataSupplier,
  } = useSWRImmutable(isPartnerCreateModalOpen || isPartnerEditModalOpen ? [API_DATA + API_SELECTLIST_SUPPLIERS, 'GET', ''] : null, ([url, method, body]) =>
    apiService({ url: url, method: method, data: body }),
  );

  const data = useMemo(() => {
    if (fetchedDataSuppliers) {
      if (!serverPagination) return fetchedDataSuppliers;
      return fetchedDataSuppliers.results;
    } else return undefined;
  }, [fetchedDataSuppliers]);

  useEffect(() => {
    if (data) {
      setSelectOptions(data);
      setLoadingSelectList(false);
    }
  }, [data, setLoadingSelectList]);

  const fields = [
    {
      label: t('basePartnerData', { ns: ['partner'] }),
      items: [
        { name: 'name', type: 'text' },
        { name: 'email', type: 'text', pattern: regExpVariables.emailPattern },
        { name: 'address', type: 'text' },
        { name: 'taxNumber', type: 'text', pattern: regExpVariables.taxNumberPattern, required: false },
        { name: 'euTaxNumber', type: 'text', pattern: regExpVariables.euTaxNumberPattern, required: false },
        { name: 'supplierId', type: 'select', selectOptions: selectOptions, selectSearch: false, nonEditable: true },
        {
          name: 'isPartnerProfile',
          type: 'boolean',
          required: false,
          default: true,
        },
      ],
    },
  ];

  const partnerProfileFields = [
    {
      label: t('partnerProfileData', { ns: ['partner'] }),
      items: [
        {
          name: 'profileName',
          type: 'text',
          required: true,
        },
        {
          name: 'eInvoicePiecesPrice',
          type: 'number',
          required: false,
        },
        {
          name: 'invoiceStorePiecesPrice',
          type: 'number',
          required: false,
        },
        {
          name: 'invoiceBoxPrice',
          type: 'number',
          required: false,
        },
        {
          name: 'navEInvoicePiecesPrice',
          type: 'number',
          required: false,
        },
        {
          name: 'navPaperInvoicePiecesPrice',
          type: 'number',
          required: false,
        },
        {
          name: 'archivePrice',
          type: 'number',
          required: false,
        },
      ],
    },
  ];

  return { fields, partnerProfileFields };
};
