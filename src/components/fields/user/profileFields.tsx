import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '../../../logics/usePermissions';

export type UserProfileProps = {
  firstName: string;
  lastName: string;
  customEmail: string;
  parentId?: string;
  hash?: string;
  loginToken?: string;
  datumLoginToken?: string;
};

export const useProfileFields = () => {
  const { t } = useTranslation(['user']);
  const { isSupportUser, isSupplierUser, isCustomerUser } = usePermissions();

  const fieldsSupportProfile = [
    {
      label: t('profileData', { ns: ['user'] }),
      items: [
        { name: 'firstName', type: 'text' },
        { name: 'lastName', type: 'text' },
        { name: 'customEmail', type: 'text', required: false },
      ],
    },
  ];

  const fieldsSupplierProfile = [
    {
      label: t('profileData', { ns: ['user'] }),
      items: [
        { name: 'firstName', type: 'text' },
        { name: 'lastName', type: 'text' },
        { name: 'customEmail', type: 'text', required: false },
        // { name: 'isBoss', type: 'boolean', required: false },
        // { name: 'isAdministrator', type: 'boolean', required: false },
      ],
    },
  ];

  const fieldsCustomerProfile = [
    {
      label: t('profileData', { ns: ['user'] }),
      items: [
        { name: 'firstName', type: 'text' },
        { name: 'lastName', type: 'text' },
        { name: 'customEmail', type: 'text', required: false },
        // { name: 'parentId', type: 'text', required: false, disabled: true },
        // { name: 'hash', type: 'password', required: false, disabled: true },
        // { name: 'loginToken', type: 'password', required: false, disabled: true },
        // { name: 'datumLoginToken', type: 'date', required: false },
      ],
    },
  ];

  return isSupportUser ? fieldsSupportProfile : isSupplierUser ? fieldsSupplierProfile : fieldsCustomerProfile;
};
