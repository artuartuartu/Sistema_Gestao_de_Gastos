using Sistema_Gestao_de_Gastos.Infrastructure;

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

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("DevCors");
app.UseAuthorization();
app.MapControllers();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
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
        context.Response.Redirect("/index.html");
    }
    return Task.CompletedTask;
});

app.Run();