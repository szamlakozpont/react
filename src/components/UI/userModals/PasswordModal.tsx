import React from 'react';
import { useTranslation } from 'react-i18next';
import { useReduxDispatch, useReduxSelector } from '../../../store/Store';
import { DialogProps } from '@mui/material';
import { useAPI } from '../../../logics/useAPI';
import { homeActions } from '../../../store/appSlices/HomeSlice';
import InputModal from '../../UI/InputModal';
import { usePasswordFields } from '../../fields/user/passwordFields';

const PasswordModal: React.FC = () => {
  const { t } = useTranslation(['user']);
  const dispatch = useReduxDispatch();
  const openPasswordModal = useReduxSelector((state) => state.home.openPasswordModal);
  const fields = usePasswordFields();
  const { userUpdatePassword } = useAPI(); 

  const handleClose = () => {
    dispatch(homeActions.setOpenPasswordModal(false));
  };

  const handleCloseModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(homeActions.setOpenPasswordModal(false));
  };

  const handleCancel = () => {
    dispatch(homeActions.setOpenPasswordModal(false));
  };

  return (
    <>
      <InputModal
        openModal={openPasswordModal}
        handleCloseModal={handleCloseModal}
        handleClose={handleClose}
        handleCancel={handleCancel}
        onSubmitFunc={userUpdatePassword}
        onSubmitSuccess={`${t('successfullUpdatedPassword', { ns: ['user'] })}`}
        resetOnSubmit
        modalTitle={t('changePassword', { ns: ['user'] })}
        contentText={t('toChangePassword', { ns: ['user'] })}
        submitText={t('submit', { ns: ['user'] })}
        fields={fields}
      />
    </>
  );
};

export default PasswordModal;
