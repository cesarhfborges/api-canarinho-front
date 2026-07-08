import { Method } from '@/app/core/models/method';

export interface Endpoint {
    id?: number;
    project_id?: number;
    parent_id?: number | null;
    name: string;
    generator: string;
    endpoints_config: any[];
    resource_schema: any[];
    custom_headers: any[];
    children?: Endpoint[];
    
    // Virtual attributes added by backend
    count?: number;
    parent?: Endpoint;

    url: string;
    method: Method;
    enabled: boolean;
    paginate?: boolean;
    per_page_default?: number;
    response: '$mockData';
};
