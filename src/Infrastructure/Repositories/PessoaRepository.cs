using Microsoft.EntityFrameworkCore;
using Sistema_Gestao_de_Gastos.Application.Interfaces;
using Sistema_Gestao_de_Gastos.Domain.Entities;
using Sistema_Gestao_de_Gastos.Infrastructure.Data;

namespace Sistema_Gestao_de_Gastos.Infrastructure.Repositories;

public class PessoaRepository : IPessoaRepository
{
    private readonly GastoContext _context;

    public PessoaRepository(GastoContext context)
    {
        _context = context;
    }

    public async Task CriarAsync(Pessoa pessoa)
    {
        await _context.Pessoas.AddAsync(pessoa);
        await _context.SaveChangesAsync();
    }

    public async Task<Pessoa?> ObterPorIdAsync(Guid id)
    {
        return await _context.Pessoas.FindAsync(id);
    }

    public async Task<List<Pessoa>> ObterTodasAsync()
    {
        return await _context.Pessoas.ToListAsync();
    }
}