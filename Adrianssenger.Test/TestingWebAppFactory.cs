using AdriassengerApi.Data;
using AdriassengerApi.Models.UserModels;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

internal class TestingWebAppFactory<TEntryPoint> : WebApplicationFactory<Program> where TEntryPoint : Program
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<ApplicationContext>));

            if (descriptor is not null) services.Remove(descriptor);

            services.AddDbContext<ApplicationContext>(options =>
            {
                options.UseInMemoryDatabase("AdrianssengerDbTest");
            });

            var sp = services.BuildServiceProvider();
            var scope = sp.CreateScope();
            var appContext = scope.ServiceProvider.GetRequiredService<ApplicationContext>();

            try
            {
                appContext.Database.EnsureCreated();
                SeedDataBase(appContext);
            }
            catch (Exception ex)
            {
                //Log errors or do anything you think it's needed
                throw new Exception(ex.Message);
            }
        });
    }

    private void SeedDataBase(ApplicationContext context)
    {
        context.Users.Add(new User { Id = 1, Email = "adikson@op.pl", UserName = "adikson", Password = "adikson" });
        context.Users.Add(new User { Id = 3, Email = "adam@op.pl", UserName = "Adam", Password = "adam" });
        context.Users.Add(new User { Id = 2, Email = "string@op.pl", UserName = "string", Password = "string" });
        
        context.SaveChanges();
    }
}