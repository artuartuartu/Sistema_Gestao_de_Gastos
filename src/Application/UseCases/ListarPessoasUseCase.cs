using Sistema_Gestao_de_Gastos.Application.Dtos.Responses;
using Sistema_Gestao_de_Gastos.Application.Interfaces;

namespace Sistema_Gestao_de_Gastos.Application.UseCases;

public class ListarPessoasUseCase
{
    private readonly IPessoaRepository _pessoaRepository;

    public ListarPessoasUseCase(IPessoaRepository pessoaRepository)
    {
        _pessoaRepository = pessoaRepository;
    }
    public async Task<List<PessoaResponse>> ExecutarAsync()
    {
        var pessoas = await _pessoaRepository.ObterTodasAsync();

        return pessoas.Select(p => new PessoaResponse(p.Id, p.Nome, p.Idade)).ToList();
    }
}