export const ReuniaoStatus = {
    AGENDADA: 'AGENDADA',
    EM_ANDAMENTO: 'EM_ANDAMENTO',
    ENCERRADA: 'ENCERRADA',
    CANCELADA: 'CANCELADA'
} as const;

export type ReuniaoStatus = (typeof ReuniaoStatus)[keyof typeof ReuniaoStatus];
