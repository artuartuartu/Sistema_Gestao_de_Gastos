namespace Sistema_Gestao_de_Gastos.Domain.Exceptions;

public class RegraDeNegocioException : Exception
{
    public RegraDeNegocioException(string mensagem) : base(mensagem) {}
}