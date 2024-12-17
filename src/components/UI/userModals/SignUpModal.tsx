import React, { Dispatch, SetStateAction } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { useTranslation } from 'react-i18next';
import { useSignUpFields } from '../../fields/user/signUpFields';
import InputModal from '../../UI/InputModal';

type SignUpModalProps = {
  openSignUpModal: boolean;
  setOpenSignUpModal: Dispatch<SetStateAction<boolean>>;
  setIsInit: Dispatch<SetStateAction<boolean>>;
};

type FormInputsProps = {
  [key: string]: any;
};

const SignUpModal: React.FC<SignUpModalProps> = ({ openSignUpModal, setOpenSignUpModal, setIsInit }) => {
  const { t } = useTranslation(['user']);
  const fields = useSignUpFields();

  const handleClose = () => {
    setOpenSignUpModal(false);
  };

  const handleCloseModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    setOpenSignUpModal(false);
  };

  const handleCancel = () => {
    setIsInit(true);
    setOpenSignUpModal(false);
  };

  const onSubmitSignUp = async (data: FormInputsProps) => {
    const userName = data.name;
    const email = data.email;
    const password = data.password;
    const passwordRe = data.passwordRe;
    handleClose();
  };

  return (
    <>
      <InputModal
        openModal={openSignUpModal}
        handleCloseModal={handleCloseModal}
        handleClose={handleClose}
        handleCancel={handleCancel}
        onSubmitProp={onSubmitSignUp}
        resetOnSubmit
        modalTitle={t('signUpTitle', { ns: ['user'] })}
        contentText={t('toSignUp', { ns: ['user'] })}
        submitText={t('signUp', { ns: ['user'] })}
        fields={fields}
      />
    </>
  );
};

export default SignUpModal;
