import React, { Dispatch, SetStateAction, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { useTranslation } from 'react-i18next';
import { useAPI } from '../../../logics/useAPI';
import { useReduxDispatch } from '../../../store/Store';
import { authActions } from '../../../store/appSlices/AuthSlice';
import InputModal from '../../UI/InputModal';
import { SignInFieldsProps, useSignInFields } from '../../fields/user/signInFields';
import SignInTFA from './SignInTFA';
import { User, UserProfile } from '../../types/User.type';
import { toast } from 'react-toastify';

type SignInModalProps = {
  openSignInModal: boolean;
  setOpenSignInModal: Dispatch<SetStateAction<boolean>>;
  setIsInit: Dispatch<SetStateAction<boolean>>;
};

const SignInModal: React.FC<SignInModalProps> = ({ openSignInModal, setOpenSignInModal, setIsInit }) => {
  const [isTFA, setIsTFA] = useState(false);
  const [user, setUser] = useState<User>();
  const [userPassword, setUserPassword] = useState('');
  const [pinCount, setPinCount] = useState<number>(0);

  const { t } = useTranslation(['user']);
  const dispatch = useReduxDispatch();
  const fields = useSignInFields();
  const { userSignIn } = useAPI();

  const handleClose = () => {
    setOpenSignInModal(false);
  };

  const handleCloseModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    setOpenSignInModal(false);
    setPinCount(0);
  };

  const handleCancel = () => {
    setIsInit(true);
    setIsTFA(false);
    setOpenSignInModal(false);
    setPinCount(0);
  };

  const handleCloseTFA = () => {
    setIsTFA(false);
    setOpenSignInModal(false);
    setPinCount(0);
  };

  const handleCancelTFA = () => {
    setIsInit(true);
    setIsTFA(false);
    setOpenSignInModal(false);
    setPinCount(0);
  };

  const storeUserData = async (access: string, refresh: string, user: User, profile: UserProfile) => {
    dispatch(authActions.setToken(access));
    dispatch(authActions.setRefreshToken(refresh));
    dispatch(authActions.setIsSignedIn(true));

    dispatch(authActions.setUserId(user.id));
    dispatch(authActions.setUserName(user.name));
    dispatch(authActions.setUserEmail(user.email));
    dispatch(authActions.setUserType(user.type));
    dispatch(authActions.setUserIsStaff(user.is_staff));
    dispatch(authActions.setUserIsSuperuser(user.is_superuser));
    dispatch(authActions.setUserIsActive(user.is_active));
    dispatch(authActions.setUserHasTFA(user.has_tfa));
    dispatch(authActions.setUserIsTFAVerified(user.is_tfa_verified));
    dispatch(authActions.setUserDateJoined(user.date_joined));
    dispatch(authActions.setUserLastLogin(user.last_login));

    if (user.type === 'support') {
      dispatch(authActions.setProfileSupportFirstName(profile.first_name));
      dispatch(authActions.setProfileSupportLastName(profile.last_name));
      dispatch(authActions.setProfileSupportCustomEmail(profile.custom_email));
      dispatch(authActions.setProfileSupportSupplierId(profile.supplier_id));
      dispatch(authActions.setProfileSupportSupplierName(profile.supplier_name));
      dispatch(authActions.setProfileSupportLanguage(profile.language));
      dispatch(authActions.setProfileSupportPhone(profile.phone));
    } else if (user.type === 'supplier') {
      dispatch(authActions.setProfileSupplierFirstName(profile.first_name));
      dispatch(authActions.setProfileSupplierLastName(profile.last_name));
      dispatch(authActions.setProfileSupplierCustomEmail(profile.custom_email));
      dispatch(authActions.setProfileSupplierSupplierId(profile.supplier_id));
      dispatch(authActions.setProfileSupplierSupplierName(profile.supplier_name));
      dispatch(authActions.setProfileSupplierLanguage(profile.language));
      dispatch(authActions.setProfileSupplierPhone(profile.phone));
    } else if (user.type === 'customer') {
      dispatch(authActions.setProfileCustomerFirstName(profile.first_name));
      dispatch(authActions.setProfileCustomerLastName(profile.last_name));
      dispatch(authActions.setProfileCustomerCustomEmail(profile.custom_email));
      dispatch(authActions.setProfileCustomerLanguage(profile.language));
      dispatch(authActions.setProfileCustomerPhone(profile.phone));
    } else throw new Error('Invalid user type');
  };

  const onSubmitSignIn = async (data: SignInFieldsProps) => {
    try {
      const { responseTFA, access, refresh, user, profile } = await userSignIn(data);
      if (responseTFA === 'no') {
        await storeUserData(access, refresh, user, profile);
      } else {
        if (responseTFA === 'yes') {
          setUserPassword(data.password);
          setUser(user);
          setIsTFA(true);
          toast.success(t('pinEmail', { ns: ['user'] }));
        }
      }

      return 'success';
    } catch (err) {
      return 'error';
    }
  };

  return (
    <>
      <InputModal
        openModal={openSignInModal}
        handleCloseModal={handleCloseModal}
        handleClose={handleClose}
        handleCancel={handleCancel}
        onSubmitProp={onSubmitSignIn}
        resetOnSubmit
        modalTitle={t('signIn', { ns: ['user'] })}
        contentText={t('toSignIn', { ns: ['user'] })}
        submitText={t('signIn', { ns: ['user'] })}
        fields={fields}
      />

      {user && (
        <SignInTFA
          openModal={isTFA}
          handleClose={handleCloseTFA}
          handleCancel={handleCancelTFA}
          user={user}
          storeUserData={storeUserData}
          userPassword={userPassword}
          pinCount={pinCount}
          setPinCount={setPinCount}
        />
      )}
    </>
  );
};

export default SignInModal;
