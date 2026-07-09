using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Sistema_Gestao_de_Gastos.Application.Interfaces;
using Sistema_Gestao_de_Gastos.Infrastructure.Data;
using Sistema_Gestao_de_Gastos.Infrastructure.Repositories;

namespace Sistema_Gestao_de_Gastos.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<GastoContext>(options =>
            options.UseSqlite(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IPessoaRepository, PessoaRepository>();
        services.AddScoped<ITransacaoRepository, TransacaoRepository>();

        return services;
    }
}