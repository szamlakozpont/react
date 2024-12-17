import React from 'react';
import { useReduxSelector } from '../store/Store';
import { ProfileSupport, ProfileCustomer, ProfileSupplier } from '../store/appSlices/AuthSlice';
import { CUSTOMER_USER_TYPE, SUPPLIER_USER_TYPE, SUPPORT_USER_TYPE } from '../utils/variables';

export const usePermissions = () => {
  const profileAdminAdmin = useReduxSelector((state) => state.auth.profileSupport);
  const profileSupplier = useReduxSelector((state) => state.auth.profileSupplier);
  const profileCustomer = useReduxSelector((state) => state.auth.profileCustomer);
  const userType = useReduxSelector((state) => state.auth.user.type);
  const userId = useReduxSelector((state) => state.auth.user.id);
  const isSuperuser = useReduxSelector((state) => state.auth.user.isSuperuser);

  const userProfile = (userType === SUPPORT_USER_TYPE ? profileAdminAdmin : userType === SUPPLIER_USER_TYPE ? profileSupplier : profileCustomer) as ProfileSupport | ProfileSupplier | ProfileCustomer;
  const isSupportUser = userType === SUPPORT_USER_TYPE;
  const isSupplierUser = userType === SUPPLIER_USER_TYPE;
  const isCustomerUser = userType === CUSTOMER_USER_TYPE;

  const userSupplierId = isSupportUser || isSupplierUser ? (userProfile as ProfileSupport | ProfileSupplier).supplierId : undefined;
  const userSupplierName = isSupportUser || isSupplierUser ? (userProfile as ProfileSupport | ProfileSupplier).supplierName : undefined;

  return {
    userId,
    userType,
    userProfile,
    isSupportUser,
    isSupplierUser,
    isCustomerUser,
    userSupplierId,
    userSupplierName,
    isSuperuser,
  };
};
