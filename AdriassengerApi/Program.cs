using AdriassengerApi;
using AdriassengerApi.Data;
using AdriassengerApi.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.Text;
using Newtonsoft.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddConfig(builder.Configuration).AddMyDependencyGroup();

// configure jwt authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(o =>
{
    o.Events = new JwtBearerEvents();
    o.Events.OnMessageReceived = context => {

        if (context.Request.Cookies.ContainsKey("AccessToken"))
        {
            context.Token = context.Request.Cookies["AccessToken"];
        }

        return Task.CompletedTask;
    };

    o.Events.OnChallenge = async context =>
    {
        context.HandleResponse();
        context.Response.StatusCode = 401;
        await context.Response.WriteAsync(
            JsonConvert.SerializeObject(
                "Unauthorized",
                new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() }));
    };

    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ClockSkew = TimeSpan.Zero,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

// mysql service
var connectionString = builder.Configuration.GetConnectionString("mysql");
builder.Services.AddDbContext<ApplicationContext>(options => 
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<GlobalErrorHandler>();
app.UseStaticFiles();
app.UseCors();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<FriendHub>("/api/Chat");

app.Run();
