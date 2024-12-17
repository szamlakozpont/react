import React from 'react';
import { tableActions } from '../store/appSlices/TableSlice';
import { useAPI } from './useAPI';
import { useReduxDispatch, useReduxSelector } from '../store/Store';
import { KeyedMutator } from 'swr';
import { API_CREATE_USER, API_DATA, API_DELETE_USER } from '../utils/variables';
import { convertKey, keyConvert } from '../utils/common';
import { DialogProps } from '@mui/material';
import { FieldsProfileProps } from '../components/UI/InputModal';

type UseUserProps = {
  mutate: KeyedMutator<any>;
};

type FormInputsProps = {
  [key: string]: any;
};

export const useUser = ({ mutate }: UseUserProps) => {
  const dispatch = useReduxDispatch();
  const rowCustom = useReduxSelector((state) => state.table.rowCustom);
  const rowId = useReduxSelector((state) => state.table.rowId);

  const { createData, updateData, deleteData } = useAPI();

  const handleOpenCreateModal = () => {
    dispatch(tableActions.setIsUserCreateModalOpen(true));
  };

  const handleCloseCreate = () => {
    dispatch(tableActions.setIsUserCreateModalOpen(false));
  };

  const handleCloseCreateModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(tableActions.setIsUserCreateModalOpen(false));
  };

  const handleCancelCreate = () => {
    dispatch(tableActions.setIsUserCreateModalOpen(false));
  };

  const onSubmitCreateProp = async (data: FormInputsProps, profileFields?: FieldsProfileProps) => {
    const newData = {} as FormInputsProps;
    const profile = {} as FormInputsProps;

    Object.keys(data).map((key: string) => {
      const profileItems = profileFields?.filter(({ items }) => items.some(({ name }) => name === key));
      if (profileItems && profileItems.length > 0) {
        profile[convertKey(key) as keyof typeof profile] = data[key as keyof typeof data];
      } else {
        newData[convertKey(key) as keyof typeof newData] = data[key as keyof typeof data];
      }
    });
    newData['profile'] = profile;

    const api = `${API_DATA}${API_CREATE_USER}`;
    try {
      await createData(api, newData);
      mutate();
    } catch (err) {
      return err;
    }
    dispatch(tableActions.setIsUserCreateModalOpen(false));
  };

  const handleOpenEditModal = (row: any) => {
    const newData = {} as any;
    Object.keys(row).map((key: string) => {
      newData[keyConvert(key)] = row[key as keyof typeof row];
    });
    dispatch(tableActions.setRowCustom(newData));
    dispatch(tableActions.setIsUserEditModalOpen(true));
  };

  const handleCloseEdit = () => {
    dispatch(tableActions.setIsUserEditModalOpen(false));
    dispatch(tableActions.setRowCustom({}));
  };

  const handleCloseEditModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(tableActions.setIsUserEditModalOpen(false));
    dispatch(tableActions.setRowCustom({}));
  };

  const handleCancelEdit = () => {
    dispatch(tableActions.setIsUserEditModalOpen(false));
    dispatch(tableActions.setRowCustom({}));
  };

  const onSubmitEditProp = async (data: FormInputsProps, profileFields?: FieldsProfileProps) => {
    const newData = {} as FormInputsProps;
    const profile = {} as FormInputsProps;

    Object.keys(data).map((key: string) => {
      const profileItems = profileFields?.filter(({ items }) => items.some(({ name }) => name === key));
      if (profileItems && profileItems.length > 0) {
        profile[convertKey(key) as keyof typeof profile] = data[key as keyof typeof data];
      } else {
        newData[convertKey(key) as keyof typeof newData] = data[key as keyof typeof data];
      }
    });
    newData['profile'] = profile;

    const id = rowCustom['id' as keyof typeof rowCustom];
    const api = `${API_DATA}/update/user/${id}`;
    try {
      await updateData(api, newData);
      mutate();
      dispatch(tableActions.setRowCustom({}));
    } catch (err) {
      return err;
    }
    dispatch(tableActions.setIsUserEditModalOpen(false));
  };

  const handleOpenDeleteModal = (rowId: string) => {
    dispatch(tableActions.setRowId(rowId));
    dispatch(tableActions.setIsUserDeleteModalOpen(true));
  };

  const handleCloseDelete = () => {
    dispatch(tableActions.setIsUserDeleteModalOpen(false));
    dispatch(tableActions.setRowId(''));
  };

  const handleCloseDeleteModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(tableActions.setIsUserDeleteModalOpen(false));
    dispatch(tableActions.setRowId(''));
  };

  const handleCancelDelete = () => {
    dispatch(tableActions.setIsUserDeleteModalOpen(false));
    dispatch(tableActions.setRowId(''));
  };

  const onDelete = async () => {
    const id = rowId;
    const api = `${API_DATA}${API_DELETE_USER}/${id}`;
    try {
      const { response } = await deleteData(api);
      mutate();
      dispatch(tableActions.setRowId(''));
    } catch (err) {
      return err;
    }
    dispatch(tableActions.setIsUserDeleteModalOpen(false));
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
