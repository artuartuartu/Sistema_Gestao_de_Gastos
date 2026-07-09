using Microsoft.EntityFrameworkCore;
using Sistema_Gestao_de_Gastos.Application.Interfaces;
using Sistema_Gestao_de_Gastos.Domain.Entities;
using Sistema_Gestao_de_Gastos.Infrastructure.Data;

namespace Sistema_Gestao_de_Gastos.Infrastructure.Repositories;

public class TransacaoRepository : ITransacaoRepository
{
    private readonly GastoContext _context;

    public TransacaoRepository(GastoContext context)
    {
        _context = context;
    }

    public async Task CriarAsync(Transacao transacao)
    {
        await _context.Transacoes.AddAsync(transacao);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Transacao>> ObterPorPessoaIdAsync(Guid pessoaId)
    {
        return await _context.Transacoes
            .Include(t => t.Pessoa)
            .Where(t => t.PessoaId == pessoaId)
            .ToListAsync();
    }
}