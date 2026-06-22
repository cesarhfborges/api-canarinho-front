import { Method } from '@/app/core/models/method';

export interface Endpoint {
    url: string;
    method: Method;
    enabled: boolean;
    paginate?: boolean;
    per_page_default?: number;
    response: '$mockData';
};
