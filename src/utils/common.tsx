import React from 'react';
import { useTranslation } from 'react-i18next';
import { NumericFormat, NumericFormatProps, numericFormatter } from 'react-number-format';
import { Order } from '../components/types/Table.type';

export const convertKey = (key: string) => {
  const keyArray = key.split(/(?=[A-Z])/);
  const lowerKeyArray = keyArray.map((item) => {
    return item.toLowerCase();
  });
  return lowerKeyArray.join('_');
 
};

export const keyConvert = (key: string) => {
  if (!/[_]/.test(key)) return key;
  return key.toLowerCase().replace(/[_][a-z0-9]/g, (group) => group.slice(-1).toUpperCase());
 
};

export const validateIsRequired = (value: string) => {
  return value ? true : 'This is a required input';
 
};

export const validateMaxLen = (max: number, text: string) => (value: string) => {
  return value.length <= max || text;

};

export const validateMinLen = (min: number, text: string) => (value: string) => {
  return value.length >= min || text;
  
};

export const validateMinMaxLen = (min: number, max: number, text: string) => (value: string) => {
  return (value.length >= min && value.length <= max) || text;
 
};

export const validateContainsDigit = (minNumberDigit: number, text: string) => (value: string) => {
  return value.replace(/\D/g, '').length === minNumberDigit || text;
 
};

export const validateContainsUpper = (minNumberUpper: number, text: string) => (value: string) => {
  return value.length - value.replace(/[A-Z]/g, '').length === minNumberUpper || text;
 
};

export type CustomProps = {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  type: any;
};

export const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(function NumericFormatCustom(props, ref) {
  const { i18n } = useTranslation();
  const { onChange, ...other } = props;
  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator={props.type === 'numeric' || props.type === 'currency' ? `${i18n.language === 'hu' ? ' ' : ','}` : false}
      valueIsNumericString
      suffix={props.type === 'currency' ? `${i18n.language === 'hu' ? ' Ft' : ' €'}` : undefined}
      decimalScale={2}
      decimalSeparator={props.type === 'numeric' || props.type === 'currency' ? `${i18n.language === 'hu' ? ',' : '.'}` : undefined}
    />
  );
});

export const Numeric = (value: string = '0', type: string) => {
  const { i18n } = useTranslation(); 
  return numericFormatter(value.toString(), {
    thousandSeparator: type === 'numeric' || type === 'currency' ? `${i18n.language === 'hu' ? ' ' : ','}` : false,
    suffix: type === 'currency' ? `${i18n.language === 'hu' ? ' Ft' : ' €'}` : undefined,
    decimalScale: 2,
    decimalSeparator: type === 'numeric' || type === 'currency' ? `${i18n.language === 'hu' ? ',' : '.'}` : undefined,
  });
};

export const descendingComparator = <T,>(a: T, b: T, orderBy: keyof T) => {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
};

export const getComparator = <Key extends keyof any>(order: Order, orderBy: Key): ((a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number) => {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
};

export const stableSort = <T,>(array: readonly T[], comparator: (a: T, b: T) => number) => {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

export function debounce<Params extends any[]>(func: (...args: Params) => any, timeout: number): (...args: Params) => void {
  let timer: NodeJS.Timeout;
  return (...args: Params) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}
