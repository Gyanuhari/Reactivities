using API.Extensions;
using API.Middleware;
using Application.Activities;
using Application.Core;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Adding Service Using Extension Methods.
builder.Services.AddApplicationServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");
app.UseAuthorization();

app.MapControllers();



using var scope = app.Services.CreateScope();
var serviceProvider = scope.ServiceProvider;
try
{
    var context = serviceProvider.GetRequiredService<DataContext>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context);
}
catch (Exception ex)
{
    var logger = serviceProvider.GetRequiredService<ILogger>();
    logger.LogError(ex, "An error occured during migration");
}

app.Run();
