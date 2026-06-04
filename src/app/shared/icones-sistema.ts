import { Icone } from '@/app/shared/models/icone';
import { PrimeIcons } from 'primeng/api';

export const ICONES_SISTEMA: Icone[] = Object.entries(PrimeIcons).map(([key, value]) => ({
    label: key
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase()),
    value
}));
