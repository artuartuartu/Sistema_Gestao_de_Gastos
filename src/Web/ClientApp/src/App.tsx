import { useState, useEffect } from "react";
import { apiService } from "./Services/api";
import type { Pessoa, Transacao } from "./Types";
import { CadastroPessoas } from "./Components/CadastroPessoas";
import { CadastroTransacoes } from "./Components/CadastroTransacoes";
import { ConsultaTotais } from "./Components/ConsultaTotais";

function App() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<'pessoas' | 'transacoes' | 'totais'>('totais');

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [listaPessoas, listaTransacoes] = await Promise.all([
        apiService.listarPessoas(),
        apiService.listarTransacoes(),
      ]);
      setPessoas(listaPessoas);
      setTransacoes(listaTransacoes);
      setErro(null);
    } catch (err: any) {
      setErro('Erro ao conectar com a API. Certifique-se de que o backend está rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-white border-b border-slate-200 py-6 px-8 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Controle de Gastos Residenciais</h1>
          </div>
          
          <nav className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setAbaAtiva('totais')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                abaAtiva === 'totais' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Consulta de Totais
            </button>
            <button
              onClick={() => setAbaAtiva('pessoas')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                abaAtiva === 'pessoas' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pessoas
            </button>
            <button
              onClick={() => setAbaAtiva('transacoes')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                abaAtiva === 'transacoes' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Transações
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {erro && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
            {erro}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12 text-slate-500 font-medium">
            Carregando informações do sistema...
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            {abaAtiva === 'totais' && (
              <ConsultaTotais pessoas={pessoas} transacoes={transacoes} />
            )}
            
            {abaAtiva === 'pessoas' && (
              <CadastroPessoas pessoas={pessoas} onAtualizar={carregarDados} />
            )}
            
            {abaAtiva === 'transacoes' && (
              <CadastroTransacoes pessoas={pessoas} transacoes={transacoes} onAtualizar={carregarDados} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
