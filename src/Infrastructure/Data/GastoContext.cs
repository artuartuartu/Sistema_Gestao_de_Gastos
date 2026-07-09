using Microsoft.EntityFrameworkCore;
using Sistema_Gestao_de_Gastos.Domain.Entities;

namespace Sistema_Gestao_de_Gastos.Infrastructure.Data;

public class GastoContext : DbContext
{
    public GastoContext(DbContextOptions<GastoContext> options) : base(options) {}

    public DbSet<Pessoa> Pessoas {get; set;}
    public DbSet<Transacao> Transacoes {get; set;}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Pessoa>(entity =>
        {
           entity.HasKey(p => p.Id);
           entity.Property(p => p.Nome).IsRequired().HasMaxLength(100);
           entity.Property(p => p.Idade).IsRequired(); 
        });

        modelBuilder.Entity<Transacao>(entity =>
        {
           entity.HasKey(t => t.Id);
           entity.Property(t => t.Descricao).IsRequired().HasMaxLength(200);
           entity.Property(t => t.Valor).HasColumnType("TEXT");
           entity.Property(t => t.Tipo).HasConversion<string>().IsRequired();
           entity.HasOne(t => t.Pessoa).WithMany().HasForeignKey("PessoaId").IsRequired();
        });

        base.OnModelCreating(modelBuilder);
    }
}