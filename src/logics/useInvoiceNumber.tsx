import React from 'react';
import { tableActions } from '../store/appSlices/TableSlice';
import { useAPI } from './useAPI';
import { useReduxDispatch, useReduxSelector } from '../store/Store';
import { KeyedMutator } from 'swr';
import { API_DATA } from '../utils/variables';
import { convertKey, keyConvert } from '../utils/common';
import { DialogProps } from '@mui/material';

type UseInvoiceNumberProps = {
  mutate: KeyedMutator<any>;
};

type FormInputsProps = {
  [key: string]: any;
};

export const useInvoiceNumber = ({ mutate }: UseInvoiceNumberProps) => {
  const dispatch = useReduxDispatch();
  const rowCustom = useReduxSelector((state) => state.table.rowCustom);
  const rowId = useReduxSelector((state) => state.table.rowId);

  const { createData, updateData, deleteData } = useAPI();

  const handleOpenCreateModal = () => {
    dispatch(tableActions.setIsInvoiceNumberCreateModalOpen(true));
  };

  const handleCloseCreate = () => {
    dispatch(tableActions.setIsInvoiceNumberCreateModalOpen(false));
  };

  const handleCloseCreateModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(tableActions.setIsInvoiceNumberCreateModalOpen(false));
  };

  const handleCancelCreate = () => {
    dispatch(tableActions.setIsInvoiceNumberCreateModalOpen(false));
  };

  const onSubmitCreateProp = async (data: FormInputsProps) => {
    const newData = {} as FormInputsProps;
    Object.keys(data).map((key: string) => {
      newData[convertKey(key) as keyof typeof newData] = data[key as keyof typeof data];
    });
    const api = `${API_DATA}/create/invoicenumber/`;
    try {
      const { response } = await createData(api, newData);
      mutate();
    } catch (err) {
      return err;
    }
    dispatch(tableActions.setIsInvoiceNumberCreateModalOpen(false));
  };

  const handleOpenEditModal = (row: any) => {
    const newData = {} as any;
    Object.keys(row).map((key: string) => {
      newData[keyConvert(key)] = row[key as keyof typeof row];
    });
    dispatch(tableActions.setRowCustom(newData));
    dispatch(tableActions.setIsInvoiceNumberEditModalOpen(true));
  };

  const handleCloseEdit = () => {
    dispatch(tableActions.setIsInvoiceNumberEditModalOpen(false));
    dispatch(tableActions.setRowCustom({}));
  };

  const handleCloseEditModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(tableActions.setIsInvoiceNumberEditModalOpen(false));
    dispatch(tableActions.setRowCustom({}));
  };

  const handleCancelEdit = () => {
    dispatch(tableActions.setIsInvoiceNumberEditModalOpen(false));
    dispatch(tableActions.setRowCustom({}));
  };

  const onSubmitEditProp = async (data: FormInputsProps) => {
    const newData = {} as FormInputsProps;
    Object.keys(data).map((key: string) => {
      newData[convertKey(key) as keyof typeof newData] = data[key as keyof typeof data];
    });
    const id = rowCustom['id' as keyof typeof rowCustom];
    const api = `${API_DATA}/update/invoicenumber/${id}`;
    try {
      const { response } = await updateData(api, newData);
      mutate();
      dispatch(tableActions.setRowCustom({}));
    } catch (err) {
      return err;
    }
    dispatch(tableActions.setIsInvoiceNumberEditModalOpen(false));
  };

  const handleOpenDeleteModal = (rowId: string) => {
    dispatch(tableActions.setRowId(rowId));
    dispatch(tableActions.setIsInvoiceNumberDeleteModalOpen(true));
  };

  const handleCloseDelete = () => {
    dispatch(tableActions.setIsInvoiceNumberDeleteModalOpen(false));
    dispatch(tableActions.setRowId(''));
  };

  const handleCloseDeleteModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;

    dispatch(tableActions.setIsInvoiceNumberDeleteModalOpen(false));
    dispatch(tableActions.setRowId(''));
  };

  const handleCancelDelete = () => {
    dispatch(tableActions.setIsInvoiceNumberDeleteModalOpen(false));
    dispatch(tableActions.setRowId(''));
  };

  const onDelete = async () => {
    const id = rowId;
    const api = `${API_DATA}/delete/invoicenumber/${id}`;
    try {
      const { response } = await deleteData(api);
      mutate();
      dispatch(tableActions.setRowId(''));
    } catch (err) {
      return err;
    }
    dispatch(tableActions.setIsInvoiceNumberDeleteModalOpen(false));
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
