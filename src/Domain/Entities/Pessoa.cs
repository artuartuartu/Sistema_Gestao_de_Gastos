namespace Sistema_Gestao_de_Gastos.Domain.Entities;

public class Pessoa 
{
    public Guid Id {get; private set;}
    public string Nome {get; private set;}
    public int Idade {get; private set;}
    private Pessoa() {}

    public Pessoa(string nome, int idade)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new RegraDeNegocioException("O nome e obrigatorio e nao pode ser vazio.");

        if (idade < 0)
            throw new RegraDeNegocioException("A idade nao pode ser um valor negativo")

        Id = Guid.NewGuid();
        Nome = nome.Trim();
        Idade = idade;
    }

    public bool Maioridade() => Idade >= 18;
}