import React from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { DataColumnsProp } from '../../types/Table.type';
import { useReduxDispatch } from '../../../store/Store';
import { tableActions } from '../../../store/appSlices/TableSlice';
import { CUSTOMER_USER_TYPE, SUPPLIER_USER_TYPE, SUPPORT_USER_TYPE, tableVariables } from '../../../utils/variables';
import { Button } from '@mui/material';

export const useDataColumnsUser = () => {
  const { t, i18n } = useTranslation(['user']);
  const dispatch = useReduxDispatch();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, rowId: string) => {
    e.preventDefault();
    dispatch(tableActions.setRowId(rowId));
    dispatch(tableActions.setIsItemModalOpen(true));
  };

  const selectOptions = [
    { id: '0', label: t('allUsers', { ns: ['user'] }) },
    { id: SUPPORT_USER_TYPE, label: t('supportUser', { ns: ['user'] }) },
    { id: SUPPLIER_USER_TYPE, label: t('supplierUser', { ns: ['user'] }) },
    { id: CUSTOMER_USER_TYPE, label: t('customerUser', { ns: ['user'] }) },
  ];

  const userTypesValue = {
    [SUPPORT_USER_TYPE]: `${t('support', { ns: ['user'] })}`,
    [SUPPLIER_USER_TYPE]: `${t('supplier', { ns: ['user'] })}`,
    [CUSTOMER_USER_TYPE]: `${t('customer', { ns: ['user'] })}`,
  };

  const dataColumns: DataColumnsProp[] = [
    { id: 'id', label: t('id', { ns: ['user'] }), type: 'number', nonEditable: true },
    { id: 'name', label: t('name', { ns: ['user'] }), type: 'string' },
    { id: 'email', label: t('email', { ns: ['user'] }), type: 'string' },
    {
      id: 'type',
      label: t('type', { ns: ['user'] }),
      type: 'select',
      component: (row) => {
        return <span className="text-nowrap">{userTypesValue[row.type as keyof typeof userTypesValue]}</span>;
      },
      select: selectOptions.slice(1),
    },
    { id: 'is_staff', label: t('isStaff', { ns: ['user'] }), type: 'boolean' },
    { id: 'is_superuser', label: t('isSuperuser', { ns: ['user'] }), type: 'boolean' },
    { id: 'is_active', label: t('isActive', { ns: ['user'] }), type: 'boolean' },
    { id: 'has_tfa', label: t('hasTFA', { ns: ['user'] }), type: 'string' },
    { id: 'is_tfa_verified', label: t('isTFAVerified', { ns: ['user'] }), type: 'boolean' },
    {
      id: 'date_joined',
      label: t('dateJoined', { ns: ['user'] }),
      type: 'date',
      component: (row) => {
        return (
          <span className="text-nowrap">
            {i18n.language === 'hu' ? dayjs.utc(row.date_joined).format('YYYY-MM-DD HH:mm:ss.SSS Z[Z]') : dayjs.utc(row.date_joined).format('DD/MM/YYYY HH:mm:ss.SSS Z[Z]')}
            {/* dayjs(row.date_joined).format('YYYY-MM-DD HH:mm:ss') : dayjs(row.date_joined).format('DD/MM/YYYY HH:mm:ss')} */}
          </span>
        );
      },
      nonEditable: true,
    },
    {
      id: 'last_login',
      label: t('lastLogin', { ns: ['user'] }),
      type: 'date',
      component: (row) => {
        if (row.last_login) {
          return <span className="text-nowrap">{i18n.language === 'hu' ? dayjs(row.last_login).format('YYYY-MM-DD HH:mm:ss') : dayjs(row.last_login).format('DD/MM/YYYY HH:mm:ss')}</span>;
        } else {
          return <></>;
        }
      },
      nonEditable: true,
    },
  ];

  const dataColumnsProfile: DataColumnsProp[] = [
    {
      id: 'supplier_name',
      label: t('supplierName', { ns: ['partner'] }),
      type: 'string',
      component: (row) => {
        return (
          <Button size="small" sx={{ textTransform: 'uppercase' }} onClick={(e) => handleClick(e, row.supplier_id)}>
            <span className={`bg-transparent ${tableVariables.buttonsColorText} text-nowrap`}>{row.supplier_name}</span>
          </Button>
        );
      },
    },
    { id: 'supplier_id', label: t('supplierId', { ns: ['partner'] }), type: 'number', hidden: true },
    { id: 'first_name', label: t('firstName', { ns: ['user'] }), type: 'string' },
    { id: 'last_name', label: t('lastName', { ns: ['user'] }), type: 'string' },
    { id: 'custom_email', label: t('customEmail', { ns: ['user'] }), type: 'string' },
    { id: 'phone', label: t('phone', { ns: ['user'] }), type: 'string' },
    { id: 'is_manager', label: t('isManager', { ns: ['user'] }), type: 'boolean' },
    { id: 'is_administrator', label: t('isAdministrator', { ns: ['user'] }), type: 'boolean' },
    // {
    //   id: 'profile_updated_at',
    //   label: t('profileUpdatedAt', { ns: ['user'] }),
    //   type: 'date',
    //   component: (row) => {
    //     if (row.profile_updated_at) {
    //       return (
    //         <span className="text-nowrap">
    //           {i18n.language === 'hu' ? dayjs.utc(row.profile_updated_at).format('YYYY-MM-DD HH:mm:ss.SSS Z[Z]') : dayjs.utc(row.profile_updated_at).format('DD/MM/YYYY HH:mm:ss.SSS Z[Z]')}
    //         </span>
    //       );
    //     } else {
    //       return <></>;
    //     }
    //   },
    //   nonEditable: true,
    // },
  ];
  return { selectOptions, userTypesValue, dataColumns, dataColumnsProfile };
};
