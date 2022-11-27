using AdriassengerApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AdriassengerApi.Data
{
    public class ApplicationContext : DbContext
    {
        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options) { }
        public virtual DbSet<Messages> messages { get; set; }
        public virtual DbSet<Friend> friends { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Connection> Connections { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }
    }
}
