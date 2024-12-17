import React from 'react';
import FormControl from '@mui/material/FormControl';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { tableVariables } from '../../utils/variables';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import { FieldError } from 'react-hook-form';

type DateTimeSelectProps = {
  selectLabel: string;
  selectValue: any;
  disabled: boolean;
  onChange: (...event: any[]) => void;
  rounded?: boolean;
  color?: string;
  minWidth?: number;
  nonEditable?: boolean;
  error: FieldError | undefined;
  dateWithTime: boolean;
  className?: string;
};

export const DateTimeSelect: React.FC<DateTimeSelectProps> = ({
  selectLabel,
  selectValue,
  disabled,
  onChange,
  error,
  rounded = true,
  color,
  minWidth = 80,
  nonEditable = false,
  dateWithTime,
  className,
}) => {
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
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: rounded ? '30px' : '0px',
            height: '30px',
            '& fieldset.MuiOutlinedInput-notchedOutline': {
              color: color ? color : tableVariables.buttonsColor,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              color: color ? color : tableVariables.buttonsColor,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              color: color ? color : tableVariables.buttonsColor,
            },
          },
        },
      },
    },
  });

  return (
    <div className={className}>
      <ThemeProvider theme={selectTheme}>
        <FormControl
          sx={{
            my: 2,
            minWidth: minWidth,
            color: 'white',
          }}
        >
          {dateWithTime ? (
            <DateTimePicker
              label={selectLabel}
              value={selectValue}
              disabled={disabled}
              onChange={onChange}
              onAccept={onChange}
              slotProps={{
                textField: {
                  error: !!error,
                  helperText: error?.message,
                },
              }}
            />
          ) : (
            <DatePicker
              label={selectLabel}
              value={selectValue}
              disabled={disabled}
              onChange={onChange}
              onAccept={onChange}
              slotProps={{
                textField: {
                  error: !!error,
                  helperText: error?.message,
                },
              }}
            />
          )}
        </FormControl>
      </ThemeProvider>
    </div>
  );
};
