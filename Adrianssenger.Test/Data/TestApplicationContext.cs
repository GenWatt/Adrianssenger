using AdriassengerApi.Data;
using AdriassengerApi.Models.UserModels;
using Microsoft.EntityFrameworkCore;

public class TestApplicationContext : IDisposable
{
    public ApplicationContext Context { get; private set; }

    public TestApplicationContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationContext>()
            .UseInMemoryDatabase("Adrian")
            .Options;

        Context = new ApplicationContext(options);
        Context.Users.Add(new User { Id = 1, Email = "adikson@op.pl", UserName = "adikson", Password = "adikson" });
        Context.Users.Add(new User { Id = 2, Email = "string@op.pl", UserName = "string", Password = "string" });
        Context.SaveChanges();
    }

    public void Dispose()
    {
        Context.Dispose();
    }
}