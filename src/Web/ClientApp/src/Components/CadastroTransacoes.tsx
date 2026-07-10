import { useState } from "react";
import { apiService } from "../Services/api";
import type { Pessoa, Transacao } from "../Types";

interface CadastroTransacoesProps {
    pessoas: Pessoa[];
    transacoes: Transacao[];
    onAtualizar: () => Promise<void>;
}

export function CadastroTransacoes({ pessoas, transacoes, onAtualizar }: CadastroTransacoesProps) {
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [tipo, setTipo] = useState<'0' | '1'>('0');
    const [pessoaId, setPessoaId] = useState('');
    const [erro, setErro] = useState<string | null>(null);
    const [enviando, setEnviando] = useState(false);

    const handleCadastrar = async (e: any) => {
        e.preventDefault();
        setErro(null);

        if (!descricao.trim() || !valor || !pessoaId) {
            setErro('Por favor, preencha todos os campos.');
            return;
        }

        const pessoaSelecionada = pessoas.find(p => p.id === pessoaId);
        if (pessoaSelecionada && pessoaSelecionada.idade < 18 && tipo === '1') {
            setErro(`${pessoaSelecionada.nome} é menor de idade. Apenas despesas podem ser cadastradas.`);
            return;
        }

        try {
            setEnviando(true);
            await apiService.cadastrarTransacao(
                descricao,
                Number(valor),
                Number(tipo),
                pessoaId
            );

            setDescricao('');
            setValor('');
            await onAtualizar();
        } catch (err) {
            const erroFormatado = err instanceof Error ? err.message : 'Ocorreu um erro inesperado.';
            setErro(erroFormatado);
        } finally {
            setEnviando(false);
        }
    };

    const obterNomePessoa = (id: string) => {
        const pessoa = pessoas.find(p => p.id === id);
        return pessoa ? pessoa.nome : 'Desconhecido';
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Gerenciamento de Transações</h2>
                <p className="text-slate-500 text-sm">Registre receitas e despesas vinculadas a uma pessoa cadastrada.</p>
            </div>

            <form onSubmit={handleCadastrar} className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-w-xl space-y-4">
                <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Nova Transação</h3>

                {erro && <div className="text-xs font-medium text-red-600 bg-red-50 p-2 rounded border border-red-100">{erro}</div>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Selecione a Pessoa</label>
                        <select
                            value={pessoaId}
                            onChange={(e) => setPessoaId(e.target.value)}
                            className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">-- Escolha uma pessoa --</option>
                            {pessoas.map(p => (
                                <option key={p.id} value={p.id}>{p.nome} ({p.idade} anos)</option>
                            ))}
                        </select>
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Descrição</label>
                        <input
                            type="text"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Ex: Compras"
                            className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Valor (R$)</label>
                        <input
                            type="number"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            placeholder="0.00"
                            step="0.01"
                            min="0.01"
                            className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Tipo</label>
                        <select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value as '0' | '1')}
                            className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="0">Despesa</option>
                            <option value="1">Receita</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={enviando}
                    className="w-full sm:w-auto cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-md shadow-xs transition-colors disabled:bg-blue-400"
                >
                    {enviando ? 'Salvando...' : 'Lançar Transação'}
                </button>
            </form>

            <div className="space-y-3">
                <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Histórico de Lançamentos</h3>

                {transacoes.length === 0 ? (
                    <p className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-lg border border-dashed border-slate-200">
                        Nenhuma transação cadastrada até o momento.
                    </p>
                ) : (
                    <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-2xs">
                        <table className="w-full text-sm text-left border-collapse bg-white">
                            <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3">Pessoa</th>
                                    <th className="px-6 py-3">Descrição</th>
                                    <th className="px-6 py-3">Tipo</th>
                                    <th className="px-6 py-3 text-right">Valor</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-slate-700">
                                {transacoes.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{obterNomePessoa(t.pessoaId)}</td>
                                        <td className="px-6 py-4">{t.descricao}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${String(t.tipo) === '1' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                                }`}>
                                                {String(t.tipo) === '1' ? 'Receita' : 'Despesa'}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-semibold ${String(t.tipo) === '1' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {String(t.tipo) === '1' ? '+' : '-'} R$ {t.valor.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
