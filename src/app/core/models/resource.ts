import { Schema } from '@/app/core/models/schema';
import { Endpoint } from '@/app/core/models/endpoint';

export interface Resource {
    id: number;
    project_id: number;
    name: string;
    generator: null;
    endpoints: Endpoint[];
    resourceSchema: Schema[];
    created_at: Date;
    updated_at: Date;
}
