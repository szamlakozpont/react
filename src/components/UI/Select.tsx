import React, { Dispatch, SetStateAction, useMemo } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { tableVariables } from '../../utils/variables';
import { SelectOptionsProp } from '../types/Table.type';
import { useReduxSelector } from '../../store/Store';
import useTextToSpeech from '../../logics/useTextToSpeech';

type SelectProps = {
  selectLabel: string;
  selectValue: string;
  onSelect: Dispatch<SetStateAction<string>>;
  selectOptions: SelectOptionsProp[];
  rounded?: boolean;
  color?: string;
  minWidth?: number;
  minHeight?: number;
  nonEditable?: boolean;
  disabled?: boolean;
};

export const SelectAutoWidth: React.FC<SelectProps> = ({
  selectLabel,
  selectValue,
  onSelect,
  selectOptions,
  rounded = true,
  color,
  minWidth = 80,
  minHeight = 30,
  nonEditable = false,
  disabled = false,
}) => {
  const isLightMode = useReduxSelector((state) => state.home.lightMode);
  const isBackground = useReduxSelector((state) => state.home.pagesWithBackground);
  const selectBorderColor = useMemo(() => (isBackground ? tableVariables.selectBorderColorBackground : tableVariables.selectBorderColor), [isBackground]);
  const selectOptionsColor = useMemo(() => (isBackground ? tableVariables.selectOptionsColorBackGround : tableVariables.selectOptionsColor), [isBackground]);
  const selectLabelTextColor = useMemo(
    () => (isLightMode ? (isBackground ? tableVariables.selectLabelTextColorBackground : tableVariables.selectLabelTextColor) : tableVariables.titleTextColorDark),
    [isBackground, isLightMode],
  );
  const buttonsColorBorder = useMemo(() => (isLightMode ? selectBorderColor : tableVariables.selectBorderColor), [isLightMode, selectBorderColor]);

  const { handlePlay, handleStop } = useTextToSpeech();

  const handleChangeSelect = (event: SelectChangeEvent) => {
    onSelect(event.target.value);
  };

  const selectTheme = createTheme({
    palette: {
      primary: {
        main: color ? color : tableVariables.buttonsColor,
      },
    },
    components: {
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: color ? color : tableVariables.buttonsColor,
            '&.MuiInputLabel-shrink': {
              color: selectLabelTextColor,
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: rounded ? '30px' : '0px',
            height: minHeight,
            '& fieldset.MuiOutlinedInput-notchedOutline': {
              color: color ? color : selectLabelTextColor,
              borderColor: buttonsColorBorder,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              color: color ? color : selectLabelTextColor,
              borderColor: tableVariables.buttonsColor,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              color: color ? color : selectLabelTextColor,
              borderColor: tableVariables.buttonsColor,
            },
          },
        },
      },
    },
  });

  return (
    <div onMouseEnter={() => handlePlay(selectLabel)} onMouseLeave={() => handleStop()}>
      <ThemeProvider theme={selectTheme}>
        <FormControl
          sx={{
            my: 2,
            minWidth: minWidth,
            color: 'white',
          }}
        >
          <InputLabel
            sx={{
              my: 0,
              minWidth: Math.max(selectLabel.length * 10, minWidth),
            }}
            id="select-autowidth-label"
          >
            {selectLabel}
          </InputLabel>
          <Select
            // MenuProps={{
            //   sx: {
            //     '&& .Mui-selected': {
            //       color: 'red',
            //       background: 'rgba(0,233,0,0.2)',
            //     },
            //   },
            // }}
            sx={{
              color: selectLabelTextColor,
              '&:hover': {
                backgroundColor: tableVariables.buttonsColor,
                color: 'white',
              },
              borderColor: buttonsColorBorder,
            }}
            labelId="select-autowidth-label"
            value={selectValue}
            onChange={handleChangeSelect}
            autoWidth
            label={selectLabel}
            disabled={disabled}
          >
            {!nonEditable ? (
              selectOptions.map((item, index) => {
                return (
                  <MenuItem
                    sx={{
                      '&:hover': {
                        backgroundColor: selectOptionsColor,
                      },
                    }}
                    key={index}
                    value={item.id}
                    disabled={nonEditable}
                  >
                    {item.label}
                  </MenuItem>
                );
              })
            ) : (
              <MenuItem value={selectValue} disabled={nonEditable || disabled}>
                {selectOptions.find((item) => item.id.toString() === selectValue)?.label}
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </ThemeProvider>
    </div>
  );
};
