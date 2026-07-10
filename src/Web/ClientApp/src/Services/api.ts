const API_URL = 'http://localhost:5234/api';

async function tratarResposta(res: Response) {
    if (res.ok) {
        if (res.status === 204) return;
        return res.json();
    }

    const textoErro = await res.text();

    let mensagem = textoErro;
    try {
        const jsonErro = JSON.parse(textoErro);
        mensagem = jsonErro.message || jsonErro.title || mensagem;
    } catch {}

    throw new Error(mensagem || 'Ocorreu um erro inesperado no servidor.');
}

export const apiService = {
    async listarPessoas() {
        const res = await fetch(`${API_URL}/pessoas`);
        return tratarResposta(res);
    },

    async cadastrarPessoa(nome: string, idade:number) {
        const res= await fetch(`${API_URL}/pessoas`, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({nome, idade})
        });
        return tratarResposta(res);
    },

    async deletarPessoa(id: string) {
        const res = await fetch(`${API_URL}/pessoas/${id}`, {
            method: 'DELETE'
        });
        return tratarResposta(res);
    },

    async listarTransacoes() {
        const res = await fetch(`${API_URL}/transacoes`);
        return tratarResposta(res);
    },

    async cadastrarTransacao(descricao: string, valor: number, tipo: number, pessoaId: string) {
        const res = await fetch(`${API_URL}/transacoes`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({descricao, valor, tipo, pessoaId})
        });
        return tratarResposta(res);
    }
};