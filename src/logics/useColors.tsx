import React, { useMemo } from 'react';
import { useReduxSelector } from '../store/Store';
import { tableVariables } from '../utils/variables';

export const useColors = () => {
  const isLightMode = useReduxSelector((state) => state.home.lightMode);
  const isBackground = useReduxSelector((state) => state.home.pagesWithBackground);

  const titleTextColor = useMemo(() => (isBackground ? tableVariables.titleTextColorBackground : tableVariables.titleTextColor), [isBackground]);
  const buttonsColorBorder = useMemo(
    () => (isBackground ? (isLightMode ? tableVariables.buttonsColorBorderBackground : tableVariables.buttonsColorBorder) : tableVariables.buttonsColorBorder),
    [isBackground, isLightMode],
  );
  const buttonsColorText = useMemo(
    () => (isBackground ? tableVariables.titleTextColorDark : isLightMode ? tableVariables.titleTextColor : tableVariables.titleTextColorDark),
    [isBackground, isLightMode],
  );

  const selectOptionsColor = useMemo(() => (isBackground ? tableVariables.selectOptionsColorBackGround : tableVariables.selectOptionsColor), [isBackground]);
  const selectLabelTextColor = useMemo(
    () => (isLightMode ? (isBackground ? tableVariables.selectLabelTextColorBackground : tableVariables.selectLabelTextColor) : tableVariables.titleTextColorDark),
    [isBackground, isLightMode],
  );
  const selectBorderColor = useMemo(
    () => (isLightMode ? (isBackground ? tableVariables.selectBorderColorBackground : tableVariables.selectBorderColor) : tableVariables.selectBorderColor),
    [isBackground, isLightMode],
  );

  return { titleTextColor, buttonsColorBorder, buttonsColorText, selectOptionsColor, selectLabelTextColor, selectBorderColor };
};
