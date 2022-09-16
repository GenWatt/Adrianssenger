using AdriassengerApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AdriassengerApi.Data
{
    public class ApplicationContext : DbContext
    {
        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options) { }
        public virtual DbSet<User> users { get; set; }
        public virtual DbSet<Messages> messages { get; set; }
        public virtual DbSet<Friends> friends { get; set; }
    }
}
