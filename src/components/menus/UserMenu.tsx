import React, { Dispatch, SetStateAction } from 'react';
import { AccountCircle } from '@mui/icons-material';
import { IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { appbarVariables } from '../../utils/variables';
import { useNavigate } from 'react-router-dom';
import { useUserItems } from './menuItems/userItems';
import { useTranslation } from 'react-i18next';
import useTextToSpeech from '../../logics/useTextToSpeech';

type UserMenuProps = {
  anchorElUser: HTMLElement | null;
  setAnchorElUser: Dispatch<SetStateAction<HTMLElement | null>>;
};

const UserMenu: React.FC<UserMenuProps> = ({ anchorElUser, setAnchorElUser }) => {
  const { t } = useTranslation(['appbar']);

  const { handlePlay, handleStop } = useTextToSpeech();

  const navigate = useNavigate();
  const userItems = useUserItems();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClickUserItem = (href: string, functionProp: () => void) => {
    setAnchorElUser(null);
    if (href) navigate(href);
    else functionProp();
  };

  return (
    <>
      <div>
        <Tooltip arrow title={t('userProfile', { ns: ['appbar'] })}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenUserMenu}
            onMouseEnter={() => handlePlay(t('userProfile', { ns: ['appbar'] }))}
            onMouseLeave={() => handleStop()}
            color="inherit"
            className="hover:scale-150"
          >
            <AccountCircle fontSize={appbarVariables.userIconsize} />
          </IconButton>
        </Tooltip>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {userItems.map((item) => (
            <MenuItem key={item.label} onClick={() => handleClickUserItem(item.href, item.functionProp)} onMouseEnter={() => handlePlay(item.label)} onMouseLeave={() => handleStop()}>
              <ListItemIcon className="pr-5">{item.icon}</ListItemIcon>
              <Typography textAlign="center">{item.label}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </div>
    </>
  );
};

export default UserMenu;
