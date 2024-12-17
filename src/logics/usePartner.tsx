import React from 'react';
import { tableActions } from '../store/appSlices/TableSlice';
import { useAPI } from './useAPI';
import { useReduxDispatch, useReduxSelector } from '../store/Store';
import { KeyedMutator } from 'swr';
import { API_DATA } from '../utils/variables';
import { convertKey, keyConvert } from '../utils/common';
import { DialogProps } from '@mui/material';
import { FieldsProfileProps } from '../components/UI/InputModal';

type UsePartnerProps = {
  mutatePartners: KeyedMutator<any>;
};

type FormInputsProps = {
  [key: string]: any;
};

export const usePartner = ({ mutatePartners }: UsePartnerProps) => {
  const dispatch = useReduxDispatch();
  const rowCustom = useReduxSelector((state) => state.table.rowCustom);
  const rowId = useReduxSelector((state) => state.table.rowId);

  const { createData, updateData, deleteData } = useAPI();

  const handleOpenCreateModal = () => {
    dispatch(tableActions.setIsPartnerCreateModalOpen(true));
  };

  const handleCloseCreate = () => {
    dispatch(tableActions.setIsPartnerCreateModalOpen(false));
  };

  const handleCloseCreateModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(tableActions.setIsPartnerCreateModalOpen(false));
  };

  const handleCancelCreate = () => {
    dispatch(tableActions.setIsPartnerCreateModalOpen(false));
  };

  const onSubmitCreateProp = async (data: FormInputsProps, profileFields?: FieldsProfileProps) => {
    const newData = {} as FormInputsProps;
    const profile = {} as FormInputsProps;

    Object.keys(data).map((key: string) => {
      if (newData['is_partner_profile']) {
        const profileItems = profileFields?.filter(({ items }) => items.some(({ name }) => name === key));
        if (profileItems && profileItems.length > 0) {
          profile[convertKey(key) as keyof typeof profile] = data[key as keyof typeof data];
        } else {
          newData[convertKey(key) as keyof typeof newData] = data[key as keyof typeof data];
        }
      } else newData[convertKey(key) as keyof typeof newData] = data[key as keyof typeof data];
    });

    if (newData['is_partner_profile']) {
      newData['profile'] = profile;

      if (newData.partner_id) {
        newData['partner'] = newData.partner_id;
      }
    }

    const api = `${API_DATA}/create/partner/`;
    try {
      await createData(api, newData);
      mutatePartners();
    } catch (err) {
      return err;
    }
    dispatch(tableActions.setIsPartnerCreateModalOpen(false));
  };

  const handleOpenEditModal = (row: any) => {
    const newData = {} as any;
    Object.keys(row).map((key: string) => {
      newData[keyConvert(key)] = row[key as keyof typeof row];
    });
    dispatch(tableActions.setRowCustom(newData));
    dispatch(tableActions.setIsPartnerEditModalOpen(true));
  };

  const handleCloseEdit = () => {
    dispatch(tableActions.setIsPartnerEditModalOpen(false));
    dispatch(tableActions.setRowCustom({}));
  };

  const handleCloseEditModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(tableActions.setIsPartnerEditModalOpen(false));
    dispatch(tableActions.setRowCustom({}));
  };

  const handleCancelEdit = () => {
    dispatch(tableActions.setIsPartnerEditModalOpen(false));
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

    const api = `${API_DATA}/update/partner/${id}`;
    try {
      await updateData(api, newData);
      mutatePartners();
      dispatch(tableActions.setRowCustom({}));
    } catch (err) {
      return err;
    }
    dispatch(tableActions.setIsPartnerEditModalOpen(false));
  };

  const handleOpenDeleteModal = (rowId: string) => {
    dispatch(tableActions.setRowId(rowId));
    dispatch(tableActions.setIsPartnerDeleteModalOpen(true));
  };
  const handleCloseDelete = () => {
    dispatch(tableActions.setIsPartnerDeleteModalOpen(false));
    dispatch(tableActions.setRowId(''));
  };

  const handleCloseDeleteModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(tableActions.setIsPartnerDeleteModalOpen(false));
    dispatch(tableActions.setRowId(''));
  };

  const handleCancelDelete = () => {
    dispatch(tableActions.setIsPartnerDeleteModalOpen(false));
    dispatch(tableActions.setRowId(''));
  };

  const onDelete = async () => {
    const id = rowId;
    const api = `${API_DATA}/delete/partner/${id}`;
    try {
      const { response } = await deleteData(api);
      mutatePartners();
      dispatch(tableActions.setRowId(''));
    } catch (err) {
      return err;
    }
    dispatch(tableActions.setIsPartnerDeleteModalOpen(false));
  };

  const handleOpenRowDetailModal = (rowId: string) => {
    dispatch(tableActions.setRowId(rowId));
    dispatch(tableActions.setIsItemModalOpen(true));
  };

  const openBulkCreatePartnersModal = () => {
    dispatch(tableActions.setIsBulkCreatePartnersModalOpen(true));
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
    openBulkCreatePartnersModal,
  };
};
