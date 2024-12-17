import React from 'react';
import { tableActions } from '../store/appSlices/TableSlice';
import { useAPI } from './useAPI';
import { useReduxDispatch, useReduxSelector } from '../store/Store';
import { KeyedMutator } from 'swr';
import { API_DATA } from '../utils/variables';
import { convertKey, keyConvert } from '../utils/common';
import { DialogProps } from '@mui/material';

type UseCustomerProps = {
  mutateCustomers: KeyedMutator<any>;
};

type FormInputsProps = {
  [key: string]: any;
};

export const useCustomer = ({ mutateCustomers }: UseCustomerProps) => {
  const dispatch = useReduxDispatch();
  const rowCustom = useReduxSelector((state) => state.table.rowCustom);
  const rowId = useReduxSelector((state) => state.table.rowId);

  const { createData, updateData, deleteData } = useAPI();

  const handleOpenCreateModal = () => {
    dispatch(tableActions.setIsCustomerCreateModalOpen(true));
  };

  const handleCloseCreate = () => {
    dispatch(tableActions.setIsCustomerCreateModalOpen(false));
  };

  const handleCloseCreateModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(tableActions.setIsCustomerCreateModalOpen(false));
  };

  const handleCancelCreate = () => {
    dispatch(tableActions.setIsCustomerCreateModalOpen(false));
  };

  const onSubmitCreateProp = async (data: FormInputsProps) => {
    const newData = {} as FormInputsProps;
    Object.keys(data).map((key: string) => {
      newData[convertKey(key) as keyof typeof newData] = data[key as keyof typeof data];
    });
    const api = `${API_DATA}/create/customer/`;
    try {
      const { response } = await createData(api, newData);
      mutateCustomers();
    } catch (err) {
      return err;
    }
    dispatch(tableActions.setIsCustomerCreateModalOpen(false));
  };

  const handleOpenEditModal = (row: any) => {
    const newData = {} as any;
    Object.keys(row).map((key: string) => {
      newData[keyConvert(key)] = row[key as keyof typeof row];
    });
    dispatch(tableActions.setRowCustom(newData));
    dispatch(tableActions.setIsCustomerEditModalOpen(true));
  };

  const handleCloseEdit = () => {
    dispatch(tableActions.setIsCustomerEditModalOpen(false));
    dispatch(tableActions.setRowCustom({}));
  };

  const handleCloseEditModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(tableActions.setIsCustomerEditModalOpen(false));
    dispatch(tableActions.setRowCustom({}));
  };

  const handleCancelEdit = () => {
    dispatch(tableActions.setIsCustomerEditModalOpen(false));
    dispatch(tableActions.setRowCustom({}));
  };

  const onSubmitEditProp = async (data: FormInputsProps) => {
    const newData = {} as FormInputsProps;
    Object.keys(data).map((key: string) => {
      newData[convertKey(key) as keyof typeof newData] = data[key as keyof typeof data];
    });
    const id = rowCustom['id' as keyof typeof rowCustom];
    const api = `${API_DATA}/update/customer/${id}`;
    try {
      await updateData(api, newData);
      mutateCustomers();
      dispatch(tableActions.setRowCustom({}));
    } catch (err) {
      return err;
    }
    dispatch(tableActions.setIsCustomerEditModalOpen(false));
  };

  const handleOpenDeleteModal = (rowId: string) => {
    dispatch(tableActions.setRowId(rowId));
    dispatch(tableActions.setIsCustomerDeleteModalOpen(true));
  };

  const handleCloseDelete = () => {
    dispatch(tableActions.setIsCustomerDeleteModalOpen(false));
    dispatch(tableActions.setRowId(''));
  };

  const handleCloseDeleteModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(tableActions.setIsCustomerDeleteModalOpen(false));
    dispatch(tableActions.setRowId(''));
  };

  const handleCancelDelete = () => {
    dispatch(tableActions.setIsCustomerDeleteModalOpen(false));
    dispatch(tableActions.setRowId(''));
  };

  const onDelete = async () => {
    const id = rowId;
    const api = `${API_DATA}/delete/customer/${id}`;
    try {
      const { response } = await deleteData(api);
      mutateCustomers();
      dispatch(tableActions.setRowId(''));
    } catch (err) {
      return err;
    }
    dispatch(tableActions.setIsCustomerDeleteModalOpen(false));
  };

  const handleOpenRowDetailModal = (rowId: string) => {
    dispatch(tableActions.setRowId(rowId));
    dispatch(tableActions.setIsItemModalOpen(true));
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
  };
};
