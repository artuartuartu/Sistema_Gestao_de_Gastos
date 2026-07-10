using Sistema_Gestao_de_Gastos.Infrastructure;
using Sistema_Gestao_de_Gastos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddOpenApi();
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("DevCors");
app.UseAuthorization();
app.MapControllers();

var rodandoNoDocker = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";

if (app.Environment.IsDevelopment() || rodandoNoDocker)
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!rodandoNoDocker)
{
    if (!app.Environment.IsDevelopment())
    {
        app.UseHttpsRedirection();
        app.UseStaticFiles();
    }
}
else
{
    app.UseStaticFiles();
}

app.MapGet("/", context =>
{
    if (app.Environment.IsDevelopment())
    {
        context.Response.Redirect("/swagger");
    }
    else
    {
        context.Response.Redirect(rodandoNoDocker ? "/api/pessoas" : "/index.html");
    }
    return Task.CompletedTask;
});

if (rodandoNoDocker)
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<GastoContext>();
        context.Database.Migrate();
    }
}

app.Run();