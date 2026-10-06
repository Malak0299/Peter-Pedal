using Microsoft.EntityFrameworkCore;
using PeterPedal.Api.Data;
using PeterPedal.Api.GraphQL;

var builder = WebApplication.CreateBuilder(args);

// The browser only lets the frontend call this API if the API allows its origin (CORS).
const string FrontendCorsPolicy = "Frontend";
builder.Services.AddCors(options =>
    options.AddPolicy(FrontendCorsPolicy, policy =>
        policy.WithOrigins(builder.Configuration["FrontendOrigin"]!).AllowAnyHeader().AllowAnyMethod()));

builder.Services.AddDbContext<PeterPedalDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("PeterPedal")));

// --- REST: controllers in Controllers/, documented by Swagger at /swagger ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- GraphQL: Query and Mutation classes in GraphQL/, served at /graphql ---
builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>();

var app = builder.Build();

// No migrations: create the database from the models on first start and add demo data.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PeterPedalDbContext>();
    db.Database.EnsureCreated();
    SeedData.Seed(db);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(FrontendCorsPolicy);
app.MapControllers();
app.MapGraphQL();

app.Run();

// Makes Program visible to WebApplicationFactory in the test project.
public partial class Program { }
