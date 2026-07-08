using Sistema_Gestao_de_Gastos.Application.Dtos.Responses;
using Sistema_Gestao_de_Gastos.Application.Interfaces;
using Sistema_Gestao_de_Gastos.Domain.Enums;

namespace Sistema_Gestao_de_Gastos.Application.UseCases;

public class ObterExtratoUseCase
{
    private readonly ITransacaoRepository _transacaoRepository;
    
    public ObterExtratoUseCase(ITransacaoRepository transacaoRepository)
    {
        _transacaoRepository = transacaoRepository;
    }

    public async Task<ExtratoResponse> ExecutarAsync(Guid pessoaId)
    {
        var transacoes = await _transacaoRepository.ObterPorPessoaIdAsync(pessoaId);
        var transacoesDetalhes = transacoes.Select(t => new TransacaoDetalhesResponse(
            t.Id,
            t.Descricao,
            t.Valor,
            t.Tipo.ToString()
        )).ToList();

        var saldoAtual = transacoes.Sum(t => t.Tipo == TipoTransacao.Receita ? t.Valor : -t.Valor);

        return new ExtratoResponse(transacoesDetalhes, saldoAtual);
    }
}