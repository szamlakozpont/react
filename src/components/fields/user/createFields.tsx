import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { API_DATA, API_SELECTLIST_SUPPLIERS, authVariables, CUSTOMER_USER_TYPE, regExpVariables, serverPagination, SUPPLIER_USER_TYPE, SUPPORT_USER_TYPE } from '../../../utils/variables';
import { useTranslation } from 'react-i18next';
import { validateContainsDigit, validateContainsUpper, validateMinLen, validateMinMaxLen } from '../../../utils/common';
import { useAxios } from '../../../logics/useAxios';
import { useReduxSelector } from '../../../store/Store';
import useSWRImmutable from 'swr/immutable';
import { usePermissions } from '../../../logics/usePermissions';

export const useCreateUserFields = (setLoadingSelectList?: Dispatch<SetStateAction<boolean>>) => {
  const { t } = useTranslation(['user']);
  const isUserCreateModalOpen = useReduxSelector((state) => state.table.isUserCreateModalOpen);
  const isUserEditModalOpen = useReduxSelector((state) => state.table.isUserEditModalOpen);
  const [selectOptions, setSelectOptions] = useState<{ [key: string]: string }>({});

  const { apiService } = useAxios();
  const { isSuperuser } = usePermissions();

  const {
    data: fetchedDataSuppliers,
    error: isLoadingDataErrorSuppliers,
    isLoading: isLoadingDataSupplier,
    isValidating: isFetchingDataSupplier,
  } = useSWRImmutable(isUserCreateModalOpen || isUserEditModalOpen ? [API_DATA + API_SELECTLIST_SUPPLIERS, 'GET', ''] : null, ([url, method, body]) =>
    apiService({ url: url, method: method, data: body }),
  );

  const data = useMemo(() => {
    if (fetchedDataSuppliers && isSuperuser !== undefined) {
      if (!serverPagination && isSuperuser !== undefined) return fetchedDataSuppliers;
      return fetchedDataSuppliers.results;
    } else return undefined;
  }, [fetchedDataSuppliers, isSuperuser]);

  useEffect(() => {
    if (setLoadingSelectList && data) {
      setSelectOptions(data);
      setLoadingSelectList(false);
    }
  }, [data, setLoadingSelectList]);

  const userTypeSelectOptions = [
    { id: SUPPORT_USER_TYPE, label: t('supportUser', { ns: ['user'] }) },
    { id: SUPPLIER_USER_TYPE, label: t('supplierUser', { ns: ['user'] }) },
    { id: CUSTOMER_USER_TYPE, label: t('customerUser', { ns: ['user'] }) },
  ];

  const fields = [
    {
      label: t('baseUserData', { ns: ['user'] }),
      items: [
        {
          name: 'name',
          type: 'text',
          validate: {
            minLen: validateMinMaxLen(
              authVariables.userNameMinCharacter,
              authVariables.userNameMaxCharacter,
              t('userMinMaxLen', { min: authVariables.userNameMinCharacter, max: authVariables.userNameMaxCharacter, ns: ['user'] }),
            ),
          },
        },
        { name: 'email', type: 'text', pattern: regExpVariables.emailPattern },
        {
          name: 'password',
          type: 'password',
          validate: {
            minLen: validateMinLen(authVariables.userPasswordMinCharacter, t('passwordMinLen', { min: authVariables.userPasswordMinCharacter, ns: ['user'] })),
            containsDigit: validateContainsDigit(authVariables.userPasswordMinDigit, t('passwordDigit', { min: authVariables.userPasswordMinDigit, ns: ['user'] })),
            containsUpper: validateContainsUpper(authVariables.userPasswordMinUpper, t('passwordUpper', { min: authVariables.userPasswordMinUpper, ns: ['user'] })),
          },
        },
        {
          name: 'passwordRe',
          type: 'password',
          validate: {
            equalField: ['password', t('passwordEqual', { ns: ['user'] })],
          },
        },
        { name: 'type', type: 'select', selectOptions: userTypeSelectOptions, nonEditable: false },
        { name: 'isStaff', type: 'boolean', required: false },
        // { name: 'isSuperuser', type: 'boolean', required: false },
        { name: 'isActive', type: 'boolean', required: false },
        // { name: 'isValid', type: 'boolean', required: false },
      ],
    },
  ];

  if (isSuperuser) {
    fields[0].items.push({ name: 'isSuperuser', type: 'boolean', required: false });
  }

  const supportUserProfileFields = [
    {
      label: t('supportProfileUserData', { ns: ['user'] }),
      items: [
        {
          name: 'firstName',
          type: 'text',
          required: false,
        },
        {
          name: 'lastName',
          type: 'text',
          required: false,
        },
        {
          name: 'customEmail',
          type: 'text',
          pattern: regExpVariables.emailPattern,
          required: false,
        },
        // { name: 'supplierId', type: 'select', selectOptions: selectOptions, selectSearch: true, nonEditable: false },
      ],
    },
  ];

  const supplierUserProfileFields = [
    {
      label: t('supplierProfileUserData', { ns: ['user'] }),
      items: [
        {
          name: 'firstName',
          type: 'text',
          required: false,
        },
        {
          name: 'lastName',
          type: 'text',
          required: false,
        },
        {
          name: 'customEmail',
          type: 'text',
          pattern: regExpVariables.emailPattern,
          required: false,
        },
        {
          name: 'isManager',
          type: 'boolean',
          required: false,
        },
        {
          name: 'isAdministrator',
          type: 'boolean',
          required: false,
        },
        { name: 'supplierId', type: 'select', selectOptions: selectOptions, selectSearch: true, nonEditable: false },
      ],
    },
  ];

  const customerUserProfileFields = [
    {
      label: t('customerProfileUserData', { ns: ['user'] }),
      items: [
        {
          name: 'firstName',
          type: 'text',
          required: false,
        },
        {
          name: 'lastName',
          type: 'text',
          required: false,
        },
        {
          name: 'customEmail',
          type: 'text',
          pattern: regExpVariables.emailPattern,
          required: false,
        },
      ],
    },
  ];

  return { fields, supportUserProfileFields, supplierUserProfileFields, customerUserProfileFields };
};
