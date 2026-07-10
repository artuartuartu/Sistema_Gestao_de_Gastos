import { useState } from "react";
import { apiService } from "../Services/api";
import type { Pessoa } from "../Types";

interface CadastroPessoasProps {
    pessoas: Pessoa[];
    onAtualizar: () => Promise<void>;
}

export function CadastroPessoas({pessoas, onAtualizar}: CadastroPessoasProps) {
    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState('');
    const [erro, setErro] = useState<string | null>(null);
    const [enviando, setEnviando] = useState(false);

    const handleCadastrar = async (e: any) => {
        e.preventDefault();
        setErro(null);

        if (!nome.trim() || !idade) {
            setErro('Por favor, preencha todos os campos.');
            return;
        }

        const regexNomeValido = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
        if (!regexNomeValido.test(nome.trim())) {
          setErro('O nome deve conter apenas letras.');
          return;
        }

        try {
            setEnviando(true);
            await apiService.cadastrarPessoa(nome, Number(idade));
            setNome('');
            setIdade('');
            await onAtualizar();
        } catch (err) {
            const erroFormatado = err instanceof Error ? err.message : 'Ocorreu um erro inesperado.';
            setErro(erroFormatado)
        } finally {
            setEnviando(false);
        }
    };

    const handleDeletar = async (id: string) => {
        if (confirm('Tem certeza que deseja deletar esta pessoa? Todas as suas transações também serão apagadas')) {
            try {
                await apiService.deletarPessoa(id);
                await onAtualizar();
            } catch (err: any) {
                alert(err.message || 'Erro ao deletar esta pessoa.');
            }
        }
    };

    return (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Gerenciamento de Pessoas</h2>
            <p className="text-slate-500 text-sm">Adicione novas pessoas ao sistema ou remova registros existentes.</p>
          </div>

          <form onSubmit={handleCadastrar} className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-w-xl space-y-4">
            <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Cadastrar Nova Pessoa</h3>
            
            {erro && <div className="text-xs font-medium text-red-600 bg-red-50 p-2 rounded border border-red-100">{erro}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Idade</label>
                <input
                  type="number"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  placeholder="Ex: 25"
                  min="0"
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-medium text-sm rounded-md shadow-xs transition-colors disabled:bg-blue-400"
            >
              {enviando ? 'Salvando...' : 'Adicionar Pessoa'}
            </button>
          </form>

          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Pessoas Cadastradas</h3>
            
            {pessoas.length === 0 ? (
              <p className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-lg border border-dashed border-slate-200">
                Nenhuma pessoa cadastrada no sistema até o momento.
              </p>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-2xs">
                <table className="w-full text-sm text-left border-collapse bg-white">
                  <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3">Nome</th>
                      <th className="px-6 py-3">Idade</th>
                      <th className="px-6 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {pessoas.map((pessoa) => (
                      <tr key={pessoa.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{pessoa.nome}</td>
                        <td className="px-6 py-4">{pessoa.idade} anos</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeletar(pessoa.id)}
                            className="text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded transition-colors cursor-pointer"
                          >
                            Deletar
                          </button>
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