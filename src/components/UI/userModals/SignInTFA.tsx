import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Zoom } from '@mui/material';
import { PinInput } from 'react-input-pin-code';
import { useColors } from '../../../logics/useColors';
import { useAPI } from '../../../logics/useAPI';
import { User, UserProfile } from '../../types/User.type';

const SignInTFA: React.FC<{
  openModal: boolean;
  user: User;
  handleClose: () => void;
  handleCancel: () => void;
  storeUserData: (access: string, refresh: string, user: User, profile: UserProfile) => Promise<void>;
  userPassword: string;
  pinCount: number;
  setPinCount: React.Dispatch<React.SetStateAction<number>>;
}> = (props) => {
  const { t, i18n } = useTranslation(['pdflink']);
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [isError, setIsError] = useState(false);
  const [isSendHash, setIsSendHash] = useState(false);

  const [isOnComplete, SetIsOnComplete] = useState(false);

  const { userSignInTFA } = useAPI();
  const { titleTextColor, buttonsColorBorder, buttonsColorText } = useColors();

  const onCompletePin = () => {
    if (!isOnComplete) {
      SetIsOnComplete(true);
      setIsSendHash(true);
    }
  };

  const onCloseTFA = useCallback(() => {
    setPin(['', '', '', '', '', '']);
    props.handleCancel();
  }, [props]);

  useEffect(() => {
    const sendHash = async () => {
      const code = pin[0] + pin[1] + pin[2] + pin[3] + pin[4] + pin[5];
      // const code = await bcrypt.hash(pin[0] + pin[1] + pin[2] + pin[3] + pin[4] + pin[5], ENCRYPT_SALT);

      const authData = {
        id: props.user.id,
        name: props.user.name,
        email: props.user.email,
        password: props.userPassword,
        code: code,
      };

      try {
        const { responseTFA, access, refresh, user, profile, TFACount } = await userSignInTFA(authData);

        if (TFACount) {
          props.setPinCount(TFACount);
        } else {
          if (profile.tfa_input_count) {
            props.setPinCount(profile.tfa_input_count);
          }
        }

        if (responseTFA !== 'valid') {
          setIsError(true);
        } else {
          await props.storeUserData(access, refresh, user, profile);
          setPin(['', '', '', '', '', '']);
          props.handleClose();
        }
      } catch (err) {
        return 'error';
      }
      return true;
    };

    if (isSendHash) {
      sendHash();
      setIsSendHash(false);
    }
  }, [i18n, isSendHash, onCloseTFA, pin, props, props.handleCancel, props.user.id, t, userSignInTFA]);

  const changePin = (values: string[]) => {
    setPin(values);
    SetIsOnComplete(false);
    values.forEach((item) => {
      if (item === '' && isError) {
        setIsError(false);
      }
    });
  };

  return (
    <>
      <Dialog open={props.openModal} onClose={onCloseTFA} scroll="paper">
        <DialogTitle className="flex items-center justify-center text-2xl py-5"></DialogTitle>
        <DialogContent dividers={true}>
          <Zoom in={true} style={{ transitionDelay: props.openModal ? '100ms' : '0ms' }} timeout={700}>
            <DialogContentText>
              <div className="items-center justify-center pb-5">
                <div className="flex items-center justify-center text-3xl pb-5">{`${t('TFATitle', { ns: ['user'] })}`}</div>
                <div className="flex items-center justify-center">{t('pleaseEnterTFA', { ns: ['user'] })}</div>
                <div className={`flex items-center justify-center ${isError ? 'pt-0 text-red-500' : 'pt-6'}`}>{isError ? t('errorPin', { ns: ['user'] }) : ''}</div>
                <div className="flex items-center justify-center mx-auto gap-7 mb-5">
                  <PinInput values={pin} onChange={(value, index, values) => changePin(values)} onComplete={() => onCompletePin()} />
                </div>
                <div
                  className={'flex items-center justify-center '}
                >{`${t('pinInputCount', { ns: ['user'] })}: ${props.pinCount} ${props.pinCount > 0 ? (props.pinCount === 1 ? t('time', { ns: ['user'] }) : t('times', { ns: ['user'] })) : ''}`}</div>
              </div>
            </DialogContentText>
          </Zoom>
        </DialogContent>
        <DialogActions>
          <div className="flex gap-9 mr-7 mb-7">
            <Button onClick={onCloseTFA}>
              <span className="bg-transparent text-red-500 px-4 border border-red-500 hover:bg-red-500 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                {t('cancel', { ns: ['user'] })}
              </span>
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SignInTFA;
