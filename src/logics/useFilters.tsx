import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { DataColumnsProp, FilterItemType } from '../components/types/Table.type';
import { serverPagination } from '../utils/variables';

type filtersType = Record<string, [type: string, operator: string, value: any][]>;
type UseFiltersProps = {
  Filters: FilterItemType[];
  Columns: DataColumnsProp[];
  fetchedData: any;
  bulkInvoices?: boolean;
};

export const useFilters = ({ Filters, Columns, fetchedData, bulkInvoices = false }: UseFiltersProps) => {
  const data = useMemo(() => {
    if (fetchedData) {
      if (bulkInvoices || !serverPagination) return fetchedData;
      if (serverPagination) return fetchedData.results;
    } else return [];
  }, [bulkInvoices, fetchedData]);

  const fetchedData_filtered = useMemo(() => {
    const filters = Object.entries<filtersType[1]>(
      Filters.reduce((all: any, filter: any) => {
        const data = [filter.type, filter.operator, filter.value];
        return { ...all, [filter.key]: all[filter.key] ? [...all[filter.key], data] : [data] };
      }, {}),
    );

    const list = data.length > 0
      ? data.filter((row: any) =>
          filters
            .map(([ColName, FilterValues]) => {
              const value = row[ColName];
              const valueStr = value?.toString();
              const valueType = Columns.find((item: any) => item.id === ColName)?.type;
              return FilterValues.map(([type, operator, value_]) => {
                if (operator === 'empty') return valueStr?.length === 0;
                if (operator === 'notempty') return valueStr?.length !== 0;
                if (value !== 0 && !value && value_ && operator === '!=') return true;

                switch (type) {
                  case 'string': {
                    if (valueType !== 'string') return true;
                    if (!valueStr) return false;
                    switch (operator) {
                      case '=':
                        return valueStr?.toLowerCase() === value_.toLowerCase();
                      case '!=':
                        return valueStr.toLowerCase() !== value_.toLowerCase();
                      case 'contains':
                        return valueStr.toLowerCase().includes(value_.toLowerCase());
                      case 'notcontains':
                        return !valueStr.toLowerCase().includes(value_.toLowerCase());
                      default:
                        return true;
                    }
                  }

                  case 'number': {
                    if (valueType !== 'number') return true;
                    if (!valueStr) return false;
                    value_ = Number(value_);
                    switch (operator) {
                      case '=':
                        return value == value_;
                      case '!=':
                        return value != value_;
                      case '>':
                        return value > value_;
                      case '<':
                        return value < value_;
                      case '>=':
                        return value >= value_;
                      case '<=':
                        return value <= value_;
                      default:
                        return false;
                    }
                  }

                  case 'boolean': {
                    if (valueType !== 'boolean') return true;
                    if (!valueStr) return false;
                    switch (operator) {
                      case '=':
                        return valueStr.toLowerCase() === value_;
                      case '!=':
                        return valueStr.toLowerCase() !== value_;
                      default:
                        return true;
                    }
                  }

                  case 'date': {
                    if (valueType !== 'date') return true;
                    if (!value || !valueStr) return false;

                    const valueTrunc = dayjs(value).format('YYYY-MM-DD');
                    const value_Trunc = dayjs(value_).format('YYYY-MM-DD');

                    const valueDate = new Date(valueTrunc).getTime();
                    const value_Date = new Date(value_Trunc).getTime();

                    switch (operator) {
                      case '>':
                        return valueDate > value_Date;
                      case '<':
                        return valueDate < value_Date;
                      case '>=':
                        return valueDate >= value_Date;
                      case '<=':
                        return valueDate <= value_Date;
                      case '=':
                        return valueDate === value_Date;
                      case '!=':
                        return valueDate !== value_Date;
                      default:
                        return true;
                    }
                  }

                  case 'datetime': {
                    if (valueType !== 'datetime') return true;
                    if (!value) return false;

                    const valueTrunc = dayjs(value).format('YYYY-MM-DD HH:mm:ss');
                    const value_Trunc = dayjs(value_).format('YYYY-MM-DD HH:mm:ss');
                    const valueDate = new Date(valueTrunc).getTime();
                    const value_Date = new Date(value_Trunc).getTime();

                    switch (operator) {
                      case '>':
                        return valueDate > value_Date;
                      case '<':
                        return valueDate < value_Date;
                      case '>=':
                        return valueDate >= value_Date;
                      case '<=':
                        return valueDate <= value_Date;
                      case '=':
                        return valueDate === value_Date;
                      case '!=':
                        return valueDate !== value_Date;
                      default:
                        return true;
                    }
                  }

                  case 'select': {
                    if (valueType !== 'select') return true;
                    if (!value) return false;
                    switch (operator) {
                      case '=':
                        return value.toLowerCase() === value_.toLowerCase();
                      case '!=':
                        return value.toLowerCase() !== value_.toLowerCase();
                      case 'contains':
                        return value.toLowerCase().includes(value_.toLowerCase());
                      case 'notcontains':
                        return !value.toLowerCase().includes(value_.toLowerCase());
                      default:
                        return true;
                    }
                  }
                }
              }).every((v) => v === true);
            })
            .every((v) => v === true),
        )
      : [];

    return list;
  }, [Columns, Filters, data]);

  return { fetchedData_filtered };
};
