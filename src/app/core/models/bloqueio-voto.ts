export interface BloqueioVoto {
    ativo: boolean;
    dataInclusao: Date;
    funcionarioId: number;
    id: number;
    motivo: string;
    pautaId: number;
}
