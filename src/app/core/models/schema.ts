import { SchemaType } from '@/app/core/models/schema-type';

export interface Schema {
    name: string;
    type: SchemaType;
    value?: string;
}
