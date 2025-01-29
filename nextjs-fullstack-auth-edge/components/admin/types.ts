export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export interface SchemaField {
    name: string;
    type: string;
    isRequired: boolean;
    isUnique: boolean;
}

export interface DatabaseSchema {
    name: string;
    fields: SchemaField[];
    data?: any[];
} 