export type DataColumnsProp = {
  id: string;
  label: string;
  type: string;
  hidden?: boolean;
  select?: {
    id: string;
    label: string;
  }[];
  nonEditable?: boolean;
  width?: string | number;
  component?: (row: any) => JSX.Element;
};

export type SelectOptionsProp = {
  [key: string]: string;
};

export enum TableFilterAction {
  ADD = 'ADD',
  DELETE = 'DELETE',
  CHANGE = 'CHANGE',
  RESET = 'RESET',
  INIT = 'INIT',
}
export type ActionType_Add = {
  type: TableFilterAction.ADD;
  data: FilterItemType;
};
export type ActionType_Delete = {
  type: TableFilterAction.DELETE;
  target: number;
};
export type ActionType_Change = { type: TableFilterAction.CHANGE; target: number; key: keyof FilterItemType; value: string; Columns: DataColumnsProp[] };
export type ActionType_Reset = {
  type: TableFilterAction.RESET;
  data: FilterItemType[];
};
export type ActionType_Init = {
  type: TableFilterAction.INIT;
  data: FilterItemType[];
};
export type ActionType = ActionType_Reset | ActionType_Add | ActionType_Delete | ActionType_Change | ActionType_Init;

export type FilterItemTypeVariations =
  | {
      type?: 'string';
      operator: '=' | '!=' | 'contains' | 'notcontains' | 'empty' | 'notempty';
      value: string;
    }
  | {
      type: 'number';
      operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'empty' | 'notempty';
      value: number;
    }
  | { type: 'boolean'; operator: '=' | '!=' | 'empty' | 'notempty'; value: boolean }
  | {
      type: 'date';
      operator: '>' | '<' | '>=' | '<=' | '=' | '!=' | 'empty' | 'notempty';
      value: any;
    }
  | {
      type: 'datetime';
      operator: '>' | '<' | '>=' | '<=' | '=' | '!=' | 'empty' | 'notempty';
      value: any;
    }
  | {
      type: 'select';
      operator: '=' | '!=' | 'contains' | 'notcontains' | 'empty' | 'notempty';
      value: string;
    };

export type FilterItemType = { key: string } & FilterItemTypeVariations;

export type Order = 'asc' | 'desc';
