import { ReuniaoStatus } from '@/app/core/models/reuniao.status';

export interface Reuniao {
    id: number;
    titulo: string;
    descricao: string;
    status: ReuniaoStatus;
    dataHoraInicio: Date;
    dataHoraFim: null | Date;
}
