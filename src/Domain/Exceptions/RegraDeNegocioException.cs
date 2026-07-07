namespace Sistema_Gestao_de_Gastos.Domain.Exception;

public class RegraDeNegocioException : Exception
{
    public RegraDeNegocioException(string mensagem) : base(mensagem) {}
}