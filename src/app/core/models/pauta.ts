export interface Pauta {
    id: number;
    titulo: string;
    descricao: string;
    tipoVoto: string;
    limiteSelecoes: number;
    exigeCodigoVoto: true;
    codigoVoto: string | null;
    tempo: string | null;
    dataHoraAbertura: Date | null;
    dataHoraEncerramento: Date | null;
    status: 'AGUARDANDO' | 'ABERTA' | 'ENCERRADA' | 'CANCELADA';
    ordem: number;
}
