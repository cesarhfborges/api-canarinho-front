import { Schema } from '@/app/core/models/schema';
import { Endpoint } from '@/app/core/models/endpoint';

export interface Resource {
    id: number;
    project_id: number;
    name: string;
    generator: null;
    count: number;
    endpoints: Endpoint[];
    resourceSchema: Schema[];
    custom_headers?: any[];
    created_at: Date;
    updated_at: Date;
}
