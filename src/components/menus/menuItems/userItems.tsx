import React, { useCallback, useMemo } from 'react';
import FaceIcon from '@mui/icons-material/Face';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTranslation } from 'react-i18next';
import { useReduxDispatch, useReduxSelector } from '../../../store/Store';
import { useAPI } from '../../../logics/useAPI';
import { authActions } from '../../../store/appSlices/AuthSlice';
import { homeActions } from '../../../store/appSlices/HomeSlice';
import { useNavigate } from 'react-router-dom';

export const useUserItems = () => {
  const { t } = useTranslation(['user']);
  const dispatch = useReduxDispatch();
  const refreshToken = useReduxSelector((state) => state.auth.refreshToken);
  const user = useReduxSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { userSignOut } = useAPI();

  const onLogout = useCallback(async () => {
    const data = {
      name: user.name,
      email: user.email,
      refresh_token: refreshToken,
    };

    try {
      await userSignOut(data);
      dispatch(authActions.logout());
      navigate('/login');
    } catch (err) {
      return err;
    }
  }, [dispatch, navigate, refreshToken, user.email, user.name, userSignOut]);

  const onProfile = useCallback(() => {
    dispatch(homeActions.setOpenProfileModal(true));
  }, [dispatch]);

  const onPassword = useCallback(() => {
    dispatch(homeActions.setOpenPasswordModal(true));
  }, [dispatch]);

  const userItems = useMemo(
    () => [
      { icon: <FaceIcon />, label: t('profile', { ns: ['user'] }), href: '', functionProp: onProfile },
      { icon: <SettingsIcon />, label: t('password', { ns: ['user'] }), href: '', functionProp: onPassword },
      { icon: <LogoutIcon />, label: t('logout', { ns: ['user'] }), href: '', functionProp: onLogout },
    ],
    [onLogout, onPassword, onProfile, t],
  );

  return userItems;
};
