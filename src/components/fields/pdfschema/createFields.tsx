import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReduxSelector } from '../../../store/Store';
import { useAxios } from '../../../logics/useAxios';
import { API_DATA, API_SELECTLIST_SUPPLIERS, serverPagination } from '../../../utils/variables';

import useSWRImmutable from 'swr/immutable';

type PdfSchemaModalProps = {
  setLoadingSelectList: Dispatch<SetStateAction<boolean>>;
  userSupplierId?: string;
};

export const useCreatePdfSchemaFields = ({ setLoadingSelectList, userSupplierId }: PdfSchemaModalProps) => {
  const { t } = useTranslation(['']);
  const isPdfSchemaCreateModalOpen = useReduxSelector((state) => state.table.isPdfSchemaCreateModalOpen);
  const isPdfSchemaEditModalOpen = useReduxSelector((state) => state.table.isPdfSchemaEditModalOpen);
  const [selectOptions, setSelectOptions] = useState<{ [key: string]: string }>({});
  const { apiService } = useAxios();

  const {
    data: fetchedDataSuppliers,
    error: isLoadingDataErrorSuppliers,
    isLoading: isLoadingDataSupplier,
    isValidating: isFetchingDataSupplier,
  } = useSWRImmutable(isPdfSchemaCreateModalOpen || isPdfSchemaEditModalOpen ? [API_DATA + API_SELECTLIST_SUPPLIERS, 'GET', ''] : null, ([url, method, body]) =>
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
      label: t('basePdfSchemaData', { ns: ['pdfschema'] }),
      items: [
        { name: 'pdfschemaName', type: 'text' },
        { name: 'supplierId', type: 'select', selectOptions: selectOptions, selectSearch: false },
      ],
    },
  ];

  const jsonFields = [
    {
      items: [
        { name: 'name', type: 'text' },
        { name: 'type', type: 'text' },
        { name: 'content', type: 'text', required: false },
        { name: 'positionX', type: 'text' },
        { name: 'positionY', type: 'text' },
        { name: 'width', type: 'text' },
        { name: 'height', type: 'text' },
        { name: 'fontSize', type: 'text' },
        { name: 'fontColor', type: 'text' },
      ],
    },
  ];

  return { fields, jsonFields };
};
