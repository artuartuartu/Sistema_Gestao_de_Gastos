export interface Pessoa {
    id: string;
    nome: string;
    idade: number;
}

export interface Transacao {
    id: string;
    descricao: string;
    valor: number;
    tipo: 'Despesa' | 'Receita';
    pessoaId: string;
    pessoaNome?: string;
}

export interface CriarPessoaDto {
    nome: string;
    idade: number;
}

export interface CriarTransacaoDto {
    descricao: string;
    valor: number;
    tipo: 'Despesa' | 'Receita';
    pessoaId: string;
}