using AdriassengerApi;
using AdriassengerApi.Data;
using AdriassengerApi.Hubs;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.Text;
using System.Text.Json.Serialization;
using Newtonsoft.Json.Serialization;
using AdriassengerApi.Repository.UserRepo;
using AdriassengerApi.Services;
using AdriassengerApi.Repository.FriendRepo;
using AdriassengerApi.Repository.NotificationsRepo;
using AdriassengerApi.Repository.MessagesRepo;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy.AllowAnyHeader().AllowAnyMethod().AllowCredentials().SetIsOriginAllowed(host => true)));
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First()));

builder.Services.AddSignalR();
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

// add authorization
builder.Services.AddAuthorization();

builder.Services.AddSingleton<ITokenManager, TokenManager>();
// repos
builder.Services.AddTransient(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddTransient<IUserRepository, UserRepository>();
builder.Services.AddTransient<IFriendRepository, FriendRepository>();
builder.Services.AddTransient<INotificationsRepository, NotificationsRepository>();
builder.Services.AddTransient<IMessagesRepository, MessagesRepository>();

builder.Services.AddSingleton<IStaticFiles, StaticFiles>();

builder.Services.AddControllers().AddNewtonsoftJson(o => {
    o.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
    o.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
}).AddJsonOptions(o => {
    o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
// mysql service
var connectionString = builder.Configuration.GetConnectionString("mysql");
builder.Services.AddDbContext<ApplicationContext>(options => 
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
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
