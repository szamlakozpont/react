import React, { useMemo } from 'react';
import { panelVariables, tableVariables } from '../utils/variables';
import backgroundImage from '../static/background.jpg';
import { useReduxSelector } from '../store/Store';

export type LayoutProps = {
  showLogo: boolean;
  children?: React.ReactNode;
};

export const Layout: React.FunctionComponent<LayoutProps> = ({ showLogo, children }) => {
  const isBackground = useReduxSelector((state) => state.home.pagesWithBackground);
  const isLightMode = useReduxSelector((state) => state.home.lightMode);

  const panelBackGroundColor = useMemo(() => (isLightMode ? panelVariables.supportPanelBackgroundColorLight : panelVariables.supportPanelBackgroundColorDark), [isLightMode]);

  const backgroundColor_ = useMemo(
    () =>
      showLogo
        ? '#ffffff'
        : isBackground
          ? isLightMode
            ? tableVariables.backgroundColor
            : tableVariables.backgroundColorBackGroundDark
          : isLightMode
            ? tableVariables.backgroundColorLightMode
            : tableVariables.backgroundColorDark,
    [isBackground, isLightMode, showLogo],
  );

  return (
    <div
      className="flex flex-col w-full min-h-screen bg-no-repeat bg-cover bg-center bg-fixed"
      style={!showLogo && isBackground ? { backgroundImage: `linear-gradient(${panelBackGroundColor}), url(${backgroundImage})` } : { backgroundColor: backgroundColor_ }}
    >
      <main className="">{children}</main>
    </div>
  );
};
