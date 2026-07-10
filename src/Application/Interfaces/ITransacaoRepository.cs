using Sistema_Gestao_de_Gastos.Domain.Entities;

namespace Sistema_Gestao_de_Gastos.Application.Interfaces;

public interface ITransacaoRepository
{
    Task CriarAsync(Transacao transacao);
    Task<List<Transacao>> ObterPorPessoaIdAsync(Guid pessoaId);
}