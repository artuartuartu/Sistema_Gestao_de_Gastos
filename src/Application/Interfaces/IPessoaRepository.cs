using Sistema_Gestao_de_Gastos.Domain.Entities;

namespace Sistema_Gestao_de_Gastos.Application.Interfaces;

public interface IPessoaRepository
{
    Task CriarAsync(Pessoa pessoa);
    Task <List<Pessoa>> ObterTodasAsync();
    Task<Pessoa?> ObterPorIdAsync(Guid id);
}