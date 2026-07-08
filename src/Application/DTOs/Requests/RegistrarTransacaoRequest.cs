using Sistema_Gestao_de_Gastos.Domain.Enums;

namespace Sistema_Gestao_de_Gastos.Application.Dtos.Requests;

public record RegistrarTransacaoRequest(
    string Descricao,
    decimal Valor,
    TipoTransacao Tipo,
    Guid PessoaId
);