using Sistema_Gestao_de_Gastos.Application.Dtos.Requests;
using Sistema_Gestao_de_Gastos.Application.Dtos.Responses;
using Sistema_Gestao_de_Gastos.Application.Interfaces;
using Sistema_Gestao_de_Gastos.Domain.Entities;

namespace Sistema_Gestao_de_Gastos.Application.UseCases;

public class CadastrarPessoaUseCase
{
    private readonly IPessoaRepository _pessoaRepository;

    public CadastrarPessoaUseCase(IPessoaRepository pessoaRepository)
    {
        _pessoaRepository = pessoaRepository;
    }

    public async Task<PessoaResponse> ExecutarAsync(CriarPessoaRequest request)
    {
        var pessoa = new Pessoa(request.Nome, request.Idade);

        await _pessoaRepository.CriarAsync(pessoa);

        return new PessoaResponse(pessoa.Id, pessoa.Nome, pessoa.Idade);
    }
}