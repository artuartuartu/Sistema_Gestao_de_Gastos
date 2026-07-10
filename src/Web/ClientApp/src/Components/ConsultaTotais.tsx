import type { Pessoa, Transacao } from "../Types";

interface ConsultaTotaisProps {
    pessoas: Pessoa[];
    transacoes: Transacao[];
}

export function ConsultaTotais({ pessoas, transacoes }: ConsultaTotaisProps) {
    const linhasTabela = pessoas.map(pessoa => {
        const transacoesDaPessoa = transacoes.filter(t => t.pessoaId === pessoa.id);
        let receitas = 0;
        let despesas = 0;

        transacoesDaPessoa.forEach(t => {
            if (String(t.tipo) === '1') {
                receitas += t.valor;
            } else {
                despesas += t.valor;
            }
        });

        const saldo = receitas - despesas;

        return {
            id: pessoa.id,
            nome: pessoa.nome,
            receitas,
            despesas,
            saldo
        };
    });

    let totalGeralReceitas = 0;
    let totalGeralDespesas = 0;

    linhasTabela.forEach(linha => {
        totalGeralReceitas += linha.receitas;
        totalGeralDespesas += linha.despesas;
    });

    const saldoGeralLiquido = totalGeralReceitas - totalGeralDespesas;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Consulta de Totais</h2>
                <p className="text-slate-500 text-sm">Resumo financeiro individual e balanço geral do sistema.</p>
            </div>

            <div className="space-y-4">
                {linhasTabela.length === 0 ? (
                    <p className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-lg border border-dashed border-slate-200">
                        Nenhuma pessoa cadastrada para calcular os totais.
                    </p>
                ) : (
                    <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-2xs">
                        <table className="w-full text-sm text-left border-collapse bg-white">
                            <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3">Pessoa</th>
                                    <th className="px-6 py-3 text-right">Total Receitas</th>
                                    <th className="px-6 py-3 text-right">Total Despesas</th>
                                    <th className="px-6 py-3 text-right">Saldo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-slate-700">
                                {linhasTabela.map((linha) => (
                                    <tr key={linha.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{linha.nome}</td>
                                        <td className="px-6 py-4 text-right text-emerald-600 font-medium">
                                            R$ {linha.receitas.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-rose-600 font-medium">
                                            R$ {linha.despesas.toFixed(2)}
                                        </td>
                                        <td className={`px-6 py-4 text-right font-semibold ${linha.saldo >= 0 ? 'text-blue-600' : 'text-amber-600'}`}>
                                            R$ {linha.saldo.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-slate-900 text-white font-semibold border-t border-slate-700 text-sm">
                                <tr>
                                    <td className="px-6 py-4">TOTAL GERAL</td>
                                    <td className="px-6 py-4 text-right text-emerald-400">
                                        R$ {totalGeralReceitas.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-rose-400">
                                        R$ {totalGeralDespesas.toFixed(2)}
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold ${saldoGeralLiquido >= 0 ? 'text-sky-400' : 'text-red-400'}`}>
                                        R$ {saldoGeralLiquido.toFixed(2)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}