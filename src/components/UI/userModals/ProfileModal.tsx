import React from 'react';
import { useTranslation } from 'react-i18next';
import { useReduxDispatch, useReduxSelector } from '../../../store/Store';
import { DialogProps } from '@mui/material';
import { useAPI } from '../../../logics/useAPI';
import { homeActions } from '../../../store/appSlices/HomeSlice';
import { usePermissions } from '../../../logics/usePermissions';
import InputModal from '../../UI/InputModal';
import { useProfileFields } from '../../fields/user/profileFields';

const ProfileModal: React.FC = () => {
  const { t } = useTranslation(['user']);
  const dispatch = useReduxDispatch();
  const openProfileModal = useReduxSelector((state) => state.home.openProfileModal);
  const fields = useProfileFields();
  const { userProfile } = usePermissions();
  const { userUpdateProfile } = useAPI();

  const handleClose = () => {
    dispatch(homeActions.setOpenProfileModal(false));
  };

  const handleCloseModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(homeActions.setOpenProfileModal(false));
  };

  const handleCancel = () => {
    dispatch(homeActions.setOpenProfileModal(false));
  };

  return (
    <InputModal
      openModal={openProfileModal}
      handleCloseModal={handleCloseModal}
      handleClose={handleClose}
      handleCancel={handleCancel}
      onSubmitFunc={userUpdateProfile}
      onSubmitSuccess={`${t('successfullUpdatedProfile', { ns: ['user'] })}`}
      modalTitle={t('userProfile', { ns: ['user'] })}
      contentText=""
      submitText={t('submit', { ns: ['user'] })}
      fields={fields}
      defaultValues={userProfile}
    />
  );
};

export default ProfileModal;
