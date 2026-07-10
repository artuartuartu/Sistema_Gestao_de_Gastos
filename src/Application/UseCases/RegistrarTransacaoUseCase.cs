using Sistema_Gestao_de_Gastos.Application.Dtos.Requests;
using Sistema_Gestao_de_Gastos.Application.Interfaces;
using Sistema_Gestao_de_Gastos.Domain.Exceptions;
using Sistema_Gestao_de_Gastos.Domain.Entities;

namespace Sistema_Gestao_de_Gastos.Application.UseCases;

public class RegistrarTransacaoUseCase
{
    private readonly ITransacaoRepository _transacaoRepository;
    private readonly IPessoaRepository _pessoaRepository;

    public RegistrarTransacaoUseCase(
        ITransacaoRepository transacaoRepository,
        IPessoaRepository pessoaRepository)
    {
        _transacaoRepository = transacaoRepository;
        _pessoaRepository = pessoaRepository;
    }

    public async Task ExecutarAsync(RegistrarTransacaoRequest request)
    {
        var pessoa = await _pessoaRepository.ObterPorIdAsync(request.PessoaId);

        if (pessoa == null)
            throw new RegraDeNegocioException("Pessoa nao encontrada para vincular a transacao.");

        var transacao = new Transacao(request.Descricao, request.Valor, request.Tipo, pessoa);

        await _transacaoRepository.CriarAsync(transacao);
    }
}