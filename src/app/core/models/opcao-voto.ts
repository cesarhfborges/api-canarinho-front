export enum TipoVoto {
    NORMAL = 'NORMAL',
    EM_BRANCO = 'EM_BRANCO',
    NULO = 'NULO'
}

export interface OpcaoVoto {
    id: number;
    titulo: string;
    descricao: string;
    ordem: number;
    icone: string;
    tipo: TipoVoto;
}
