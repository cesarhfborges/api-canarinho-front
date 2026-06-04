export interface Pauta {
    id: number;
    titulo: string;
    descricao: string;
    tipoVoto: string;
    limiteSelecoes: number;
    exigeCodigoVoto: true;
    codigoVoto: string;
    dataHoraAbertura: Date;
    dataHoraEncerramento: Date | null;
    status: 'AGUARDANDO' | 'ABERTA' | 'ENCERRADA' | 'CANCELADA';
    ordem: number;
}
