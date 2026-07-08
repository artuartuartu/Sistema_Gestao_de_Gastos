using Sistema_Gestao_de_Gastos.Domain.Enums;
using Sistema_Gestao_de_Gastos.Domain.Exceptions;

namespace Sistema_Gestao_de_Gastos.Domain.Entities;

public class Transacao 
{
    public Guid Id {get; private set;}
    public string Descricao {get; private set;}
    public decimal Valor {get; private set;}
    public TipoTransacao Tipo {get; private set;}
    public Guid PessoaId {get; private set;}

    private Transacao()
    {
        Descricao = null!;
    }

    public Transacao(string descricao, decimal valor, TipoTransacao tipo, Pessoa pessoa)
    {
        if (string.IsNullOrWhiteSpace(descricao))
            throw new RegraDeNegocioException("A descricao e obrigatoria e nao pode ser vazia.");
        
        if (valor <= 0)
            throw new RegraDeNegocioException("O valor da transacao precisa ser maior que 0.");

        if (pessoa == null)
            throw new ArgumentNullException(nameof(pessoa), "A transacao precisa estar vinculada a uma pessoa cadastrada.");

        if (!(pessoa.Maioridade()) && tipo == TipoTransacao.Receita)
            throw new IdadeMinimaException();

        Id = Guid.NewGuid();
        Descricao = descricao.Trim();
        Valor = valor;
        Tipo = tipo;
        PessoaId = pessoa.Id;
    }
}