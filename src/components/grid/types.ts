export type ColumnType =
    | 'TEXT'
    | 'NUMBER'
    | 'CURRENCY'
    | 'DATE'
    | 'CHECKBOX'
    | 'SELECT'
    | 'MULTI_SELECT'
    | 'FILE'
    | 'LONG_TEXT'
    | 'USER'
    | 'CREATED_BY'
    | 'UPDATED_BY'
    | 'AUTO_NUMBER'

export interface GridColumn {
    id: string
    name: string
    type: ColumnType
    width?: number
    options?: any
}

export interface GridRow {
    id: string
    [key: string]: any
}
