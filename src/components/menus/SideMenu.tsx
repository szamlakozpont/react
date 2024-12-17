import React, { Dispatch, SetStateAction, useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { Avatar, Collapse, Grid, ListItemButton, Drawer, Typography, ListItemAvatar, ListItemText, ListItem } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useSideMenuItems } from './menuItems/sideMenuItems';
import { sidebarVariables } from '../../utils/variables';
import { useReduxSelector } from '../../store/Store';
import { usePermissions } from '../../logics/usePermissions';
import { useNavigate } from 'react-router-dom';

type SideMenuProps = {
  stateDrawer: boolean;
  setStateDrawer: Dispatch<SetStateAction<boolean>>;
};

type SideMenuItemProps = {
  depthPadding: number;
  depth: number;
  item: any;
  stateDrawer: boolean;
  setStateDrawer: Dispatch<SetStateAction<boolean>>;
};

const SidebarItem: React.FC<SideMenuItemProps> = ({ depthPadding, depth, item, stateDrawer, setStateDrawer }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { label, Icon, items, href, functionProp: functionProp } = item;

  function onClick() {
    if (Array.isArray(items)) {
      setOpen(!open);
    } else if (href) {
      navigate(href);
      setStateDrawer(false);
    } else if (functionProp) {
      setStateDrawer(false);
      functionProp();
    }
  }

  let expandIcon;
  if (Array.isArray(items) && items.length) {
    expandIcon = open ? <ExpandLess /> : <ExpandMore />;
  }

  return (
    <>
      <ListItemButton className="cursor-pointer" onClick={onClick}>
        <div
          style={{
            paddingLeft: depth * depthPadding,
            paddingBottom: depth === 1 ? sidebarVariables.listItemPadding : sidebarVariables.listItemPaddingDepth,
          }}
          className="flex"
        >
          {Icon && <Icon fontSize="medium" color={sidebarVariables.iconsColor} />}
          <div className="pl-1">{label}</div>
        </div>
        {expandIcon}
      </ListItemButton>

      <Collapse in={open}>
        {Array.isArray(items) && (
          <List component="div" disablePadding dense>
            {items.map((subItem: any, index: number) => (
              <React.Fragment key={`${subItem.name}${index}`}>
                {subItem === 'divider' ? (
                  <Divider style={{ margin: '6px 0' }} />
                ) : (
                  <SidebarItem depth={depth + 1} depthPadding={depthPadding} item={subItem} stateDrawer={stateDrawer} setStateDrawer={setStateDrawer} />
                )}
              </React.Fragment>
            ))}
          </List>
        )}
      </Collapse>
    </>
  );
};

const SideMenu: React.FC<SideMenuProps> = ({ stateDrawer, setStateDrawer }) => {
  const user = useReduxSelector((state) => state.auth.user);
  const { userProfile } = usePermissions();
  const sideMenuItems = useSideMenuItems();
  const depthPadding = sidebarVariables.depthPadding;
  const depth = 0;

  const handlerDrawerClose = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event && event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setStateDrawer(open);
  };

  const list = () => (
    <Box sx={{ width: sidebarVariables.sidebarWidth }} role="presentation">
      <div>
        <Grid
          sx={{
            backgroundColor: sidebarVariables.backgrounColor,
            backgroundImage: sidebarVariables.backgroundImage,
            backgroundSize: 'cover',
            overflow: 'hidden',
            height: sidebarVariables.gridHeight,
            color: '#fff',
            padding: '15px',
          }}
        >
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar sx={{ color: sidebarVariables.avatarColor, backgroundColor: sidebarVariables.avatarBackgroundColor }}>JD</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={userProfile.firstName && userProfile.lastName ? userProfile.firstName + ' ' + userProfile.lastName : user.name ? user.name : ''}
              secondary={
                <>
                  <Typography sx={{ display: 'block' }} component="div" variant="body2" color="white">
                    {user.email ? user.email : ''}
                  </Typography>
                </>
              }
            />
          </ListItem>
        </Grid>
      </div>

      <List sx={{ width: '100%', maxWidth: sidebarVariables.sidebarWidth, bgcolor: 'background.paper' }} disablePadding dense>
        {sideMenuItems.map((item: any, index: number) => {
          return (
            <React.Fragment key={`${item.name}${index}`}>
              {item.name === 'divider' ? (
                <Divider style={{ margin: '6px 0' }} />
              ) : (
                <SidebarItem depthPadding={depthPadding} depth={depth} item={item} stateDrawer={stateDrawer} setStateDrawer={setStateDrawer} />
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );

  return (
    <div>
      <>
        <Drawer anchor={'left'} open={stateDrawer} onClose={handlerDrawerClose(false)}>
          {list()}
        </Drawer>
      </>
    </div>
  );
};

export default SideMenu;
