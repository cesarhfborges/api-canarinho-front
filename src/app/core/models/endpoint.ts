import { Method } from '@/app/core/models/method';

export interface Endpoint {
    url: string;
    method: Method;
    enabled: boolean;
    paginate: boolean;
    response: '$mockData';
    per_page_default: number;
};
