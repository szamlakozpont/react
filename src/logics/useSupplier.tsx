import React from 'react';
import { tableActions } from '../store/appSlices/TableSlice';
import { useAPI } from './useAPI';
import { useReduxDispatch, useReduxSelector } from '../store/Store';
import { KeyedMutator } from 'swr';
import { API_CREATE_SUPPLIER, API_DATA, API_DELETE_SUPPLIER } from '../utils/variables';
import { convertKey, keyConvert } from '../utils/common';
import { DialogProps } from '@mui/material';
import { usePermissions } from './usePermissions';
import { authActions } from '../store/appSlices/AuthSlice';

type UseSupplierProps = {
  mutateSuppliers: KeyedMutator<any>;
};

type FormInputsProps = {
  [key: string]: any;
};

export const useSupplier = ({ mutateSuppliers }: UseSupplierProps) => {
  const dispatch = useReduxDispatch();
  const rowCustom = useReduxSelector((state) => state.table.rowCustom);
  const rowId = useReduxSelector((state) => state.table.rowId);

  const { createData, updateData, deleteData } = useAPI();
  const { isSupportUser, isSupplierUser, isCustomerUser, userSupplierId, userSupplierName } = usePermissions();

  const handleOpenCreateModal = () => {
    dispatch(tableActions.setIsSupplierCreateModalOpen(true));
  };

  const handleCloseCreate = () => {
    dispatch(tableActions.setIsSupplierCreateModalOpen(false));
  };

  const handleCloseCreateModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(tableActions.setIsSupplierCreateModalOpen(false));
  };

  const handleCancelCreate = () => {
    dispatch(tableActions.setIsSupplierCreateModalOpen(false));
  };

  const onSubmitCreateProp = async (data: FormInputsProps) => {
    const newData = {} as FormInputsProps;
    Object.keys(data).map((key: string) => {
      newData[convertKey(key) as keyof typeof newData] = data[key as keyof typeof data];
    });
    const api = API_DATA + API_CREATE_SUPPLIER;
    try {
      const { response } = await createData(api, newData);
      mutateSuppliers();
    } catch (err) {
      return err;
    }
    dispatch(tableActions.setIsSupplierCreateModalOpen(false));
  };

  const handleOpenEditModal = (row: any) => {
    const newData = {} as any;
    Object.keys(row).map((key: string) => {
      newData[keyConvert(key)] = row[key as keyof typeof row];
    });
    dispatch(tableActions.setRowCustom(newData));
    dispatch(tableActions.setIsSupplierEditModalOpen(true));
  };

  const handleCloseEdit = () => {
    dispatch(tableActions.setIsSupplierEditModalOpen(false));
    dispatch(tableActions.setRowCustom({}));
  };

  const handleCloseEditModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(tableActions.setIsSupplierEditModalOpen(false));
    dispatch(tableActions.setRowCustom({}));
  };

  const handleCancelEdit = () => {
    dispatch(tableActions.setIsSupplierEditModalOpen(false));
    dispatch(tableActions.setRowCustom({}));
  };

  const modifyUserProfileSupplier = (id: string, newData: FormInputsProps) => {
    if (isSupportUser) {
      dispatch(authActions.setProfileSupportSupplierId(newData.supplierId));
      dispatch(authActions.setProfileSupportSupplierName(newData.supplierName));
    } else if (isSupplierUser) {
      dispatch(authActions.setProfileSupplierSupplierId(newData.supplierId));
      dispatch(authActions.setProfileSupplierSupplierName(newData.supplierName));
    }
  };

  const onSubmitEditProp = async (data: FormInputsProps) => {
    const newData = {} as FormInputsProps;
    Object.keys(data).map((key: string) => {
      newData[convertKey(key) as keyof typeof newData] = data[key as keyof typeof data];
    });
    const id = rowCustom['id' as keyof typeof rowCustom];
    const api = `${API_DATA}/update/supplier/${id}`;
    try {
      const { response } = await updateData(api, newData);
      mutateSuppliers();
      dispatch(tableActions.setRowCustom({}));
      if (userSupplierId === id) modifyUserProfileSupplier(id, newData);
    } catch (err) {
      return err;
    }
    dispatch(tableActions.setIsSupplierEditModalOpen(false));
  };

  const handleOpenDeleteModal = (rowId: string) => {
    dispatch(tableActions.setRowId(rowId));
    dispatch(tableActions.setIsSupplierDeleteModalOpen(true));
  };
  const handleCloseDelete = () => {
    dispatch(tableActions.setIsSupplierDeleteModalOpen(false));
    dispatch(tableActions.setRowId(''));
  };

  const handleCloseDeleteModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(tableActions.setIsSupplierDeleteModalOpen(false));
    dispatch(tableActions.setRowId(''));
  };

  const handleCancelDelete = () => {
    dispatch(tableActions.setIsSupplierDeleteModalOpen(false));
    dispatch(tableActions.setRowId(''));
  };

  const onDelete = async () => {
    const id = rowId;
    const api = `${API_DATA}${API_DELETE_SUPPLIER}/${id}`;
    try {
      const { response } = await deleteData(api);
      mutateSuppliers();
      dispatch(tableActions.setRowId(''));
    } catch (err) {
      return err;
    }
    dispatch(tableActions.setIsSupplierDeleteModalOpen(false));
  };

  const handleOpenRowDetailModal = (rowId: string) => {
    dispatch(tableActions.setRowId(rowId));
    dispatch(tableActions.setIsItemModalOpen(true));
  };

  const openBulkCreateSuppliersModal = () => {
    dispatch(tableActions.setIsBulkCreateSuppliersModalOpen(true));
  };

  return {
    handleOpenCreateModal,
    handleCloseCreate,
    handleCloseCreateModal,
    handleCancelCreate,
    onSubmitCreateProp,
    handleOpenEditModal,
    handleCloseEdit,
    handleCloseEditModal,
    handleCancelEdit,
    onSubmitEditProp,
    handleOpenDeleteModal,
    handleCloseDelete,
    handleCloseDeleteModal,
    handleCancelDelete,
    onDelete,
    handleOpenRowDetailModal,
    openBulkCreateSuppliersModal,
  };
};
