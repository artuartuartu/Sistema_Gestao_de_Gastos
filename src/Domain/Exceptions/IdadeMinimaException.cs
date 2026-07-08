namespace Sistema_Gestao_de_Gastos.Domain.Exceptions;

public class IdadeMinimaException : Exception
{
    public IdadeMinimaException()
        : base("Menores de idade so podem registrar transacoes do tipo despesa.") {}
}