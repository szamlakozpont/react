import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Autocomplete, CircularProgress, TextField, ThemeProvider, createTheme } from '@mui/material';
import { API_DATA, serverPagination, tableVariables } from '../../utils/variables';
import { SelectOptionsProp } from '../types/Table.type';
import useSWR from 'swr';
import { useAxios } from '../../logics/useAxios';
import { useReduxSelector } from '../../store/Store';
import useTextToSpeech from '../../logics/useTextToSpeech';

type SelectSearchProps = {
  selectLabel: string;
  selectOptions?: OptionsProps[];
  selectValue: string;
  onSelect: Dispatch<SetStateAction<string>>;
  rounded?: boolean;
  color?: string;
  minWidth?: number;
  minHeight?: number;
  nonEditable?: boolean;
  async?: boolean;
  apiLink?: string;
  initSelectOptions?: OptionsProps;
  defaultSelectOptions?: OptionsProps;
  disabled?: boolean;
};
type OptionsProps = {
  id: string;
  label: string;
};

export const SelectSearch: React.FC<SelectSearchProps> = ({
  selectLabel,
  selectValue,
  onSelect,
  selectOptions,
  rounded = true,
  color,
  minWidth = 80,
  minHeight = 30,
  nonEditable = false,
  async = false,
  apiLink,
  initSelectOptions,
  defaultSelectOptions,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<OptionsProps[]>([]);
  const { apiService } = useAxios();
  const [init, setInit] = useState(true);

  const { handlePlay, handleStop } = useTextToSpeech();

  const {
    data: fetchedData,
    error: isLoadingDataError,
    isLoading: isLoadingData,
    isValidating: isFetchingData,
  } = useSWR(async && open ? [API_DATA + apiLink, 'GET', ''] : null, ([url, method, body]) => apiService({ url: url, method: method, data: body }));

  const data = useMemo(() => {
    if (fetchedData) {
      if (!serverPagination) return fetchedData;
      return fetchedData.results;
    } else return undefined;
  }, [fetchedData]);

  useEffect(() => {
    if (init && defaultSelectOptions) {
      setOptions([defaultSelectOptions]);
      setInit(false);
    } else setInit(false);
  }, [defaultSelectOptions, init, options]);

  useEffect(() => {
    if (!async && selectOptions) {
      setOptions(selectOptions);
    } else if (async && open && fetchedData && !isLoadingData) {
      if (initSelectOptions) {
        setOptions([initSelectOptions, ...data]);
      } else {
        setOptions(data);
      }
    }
  }, [async, data, fetchedData, initSelectOptions, isLoadingData, open, selectOptions]);

  const handleChangeSelect = (data: SelectOptionsProp | null) => {
    if (data) onSelect(data.id);
  };

  const isLightMode = useReduxSelector((state) => state.home.lightMode);
  const isBackground = useReduxSelector((state) => state.home.pagesWithBackground);
  const selectBorderColor = useMemo(() => (isBackground ? tableVariables.selectBorderColorBackground : tableVariables.selectBorderColor), [isBackground]);
  const selectOptionsColor = useMemo(() => (isBackground ? tableVariables.selectOptionsColorBackGround : tableVariables.selectOptionsColor), [isBackground]);
  const selectLabelTextColor = useMemo(
    () => (isLightMode ? (isBackground ? tableVariables.selectLabelTextColorBackground : tableVariables.selectLabelTextColor) : tableVariables.titleTextColorDark),
    [isBackground, isLightMode],
  );
  const buttonsColorBorder = useMemo(() => (isLightMode ? selectBorderColor : tableVariables.selectBorderColor), [isLightMode, selectBorderColor]);

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
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: tableVariables.buttonsColor,
            },
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          root: {
            borderRadius: rounded ? '30px' : '0px',
            height: minHeight,
            // '& fieldset.MuiOutlinedInput-notchedOutline': {
            //   color: color ? color : selectLabelTextColor,
            //   borderColor: selectBorderColor,
            // },
            // '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            //   color: color ? color : selectLabelTextColor,
            //   borderColor: selectBorderColor,
            // },
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
        <Autocomplete
          disablePortal
          sx={{
            my: 2,
            color: 'white',
            '&:hover': {
              backgroundColor: tableVariables.buttonsColor,
              borderColor: buttonsColorBorder,
              color: 'white',
              '& .MuiInputBase-root': { color: 'white' },
            },
            '& fieldset': {
              borderRadius: rounded ? 30 : 0,
              borderColor: buttonsColorBorder,
              minWidth: minWidth,
            },
            '& .MuiInputBase-root': {
              height: minHeight,
              color: selectLabelTextColor,
              borderColor: buttonsColorBorder,
            },
            '& + .MuiAutocomplete-popper .MuiAutocomplete-option:hover': {
              backgroundColor: selectOptionsColor,
            },
          }}
          size="small"
          options={!nonEditable ? options : []}
          getOptionLabel={(item: SelectOptionsProp) => item.label}
          disableClearable={true}
          renderInput={(params) => (
            <TextField
              sx={{ minWidth: minWidth }}
              {...params}
              label={selectLabel}
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {async && isLoadingData ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
          ListboxProps={{
            style: {
              maxHeight: '250px',
            },
          }}
          onChange={(e, data) => handleChangeSelect(data)}
          value={!init ? options.find((item) => item.id === selectValue) : options ? options[0] : undefined}
          defaultValue={defaultSelectOptions ? defaultSelectOptions : undefined}
          getOptionDisabled={(option) => nonEditable}
          open={async ? open : undefined}
          onOpen={
            async
              ? () => {
                  setOpen(true);
                }
              : undefined
          }
          onClose={
            async
              ? () => {
                  setOpen(false);
                }
              : undefined
          }
          loading={async && isLoadingData}
          disabled={disabled}
        />
      </ThemeProvider>
    </div>
  );
};
