import React from 'react';
import { useTranslation } from 'react-i18next';

export type passwordFieldsProps = {
  oldPassword: string;
  newPassword: string;
  newPasswordRe: string;
};

export const usePasswordFields = () => {
  const { t } = useTranslation(['user']);
  return [
    {
      label: t('passwordData', { ns: ['user'] }),
      items: [
        { name: 'oldPassword', type: 'password' },
        { name: 'newPassword', type: 'password' },
        { name: 'newPasswordRe', type: 'password' },
      ],
    },
  ];
};
