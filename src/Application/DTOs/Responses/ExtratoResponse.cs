namespace Sistema_Gestao_de_Gastos.Application.Dtos.Responses;

public record ExtratoResponse(
    List<TransacaoDetalhesResponse> Transacoes,
    decimal SaldoAtual
);

public record TransacaoDetalhesResponse(
    Guid Id,
    string Descricao,
    decimal Valor,
    string Tipo
);