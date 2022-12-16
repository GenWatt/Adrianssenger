using AdriassengerApi.Repository.FriendRepo;
using AdriassengerApi.Repository.MessagesRepo;
using AdriassengerApi.Repository.NotificationsRepo;
using AdriassengerApi.Repository.UserRepo;
using AdriassengerApi.Services;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Microsoft.OpenApi.Models;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class DependencyGroup
    {
        public static IServiceCollection AddConfig(this IServiceCollection services, IConfiguration config)
        {
            return services;
        }

        public static IServiceCollection AddMyDependencyGroup(this IServiceCollection services)
        {
            // swagger auth config
            var securityScheme = new OpenApiSecurityScheme()
            {
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "JSON Web Token based security",
            };

            var securityReq = new OpenApiSecurityRequirement()
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] {}
                }
            };

            var info = new OpenApiInfo()
            {
                Version = "v1",
                Title = "AdrianssengerApi",
                Description = "Chat to everyone",
            };

            // repos
            services.AddTransient(typeof(IRepository<>), typeof(Repository<>));
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<IFriendRepository, FriendRepository>();
            services.AddTransient<INotificationsRepository, NotificationsRepository>();
            services.AddTransient<IMessagesRepository, MessagesRepository>();
            // other services
            services.AddSingleton<ITokenManager, TokenManager>();
            services.AddSingleton<IStaticFiles, StaticFiles>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            // add authorization
            services.AddAuthorization();

            services.AddCors(options => options.AddDefaultPolicy(policy => policy.AllowAnyHeader().AllowAnyMethod().AllowCredentials().SetIsOriginAllowed(host => true)));
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(c => {
                c.SwaggerDoc("v1", info);
                c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
                c.AddSecurityDefinition("Bearer", securityScheme);
                c.AddSecurityRequirement(securityReq);
            });

            services.AddSignalR();

            services.AddControllers().AddNewtonsoftJson(o => {
                o.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                o.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            }).AddJsonOptions(o => {
                o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            });

            return services;
        }
    }
}