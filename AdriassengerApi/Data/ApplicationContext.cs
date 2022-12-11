using AdriassengerApi.Models.Friends;
using AdriassengerApi.Models.Messages;
using AdriassengerApi.Models.Notifications;
using AdriassengerApi.Models.UserModels;
using Microsoft.EntityFrameworkCore;

namespace AdriassengerApi.Data
{
    public class ApplicationContext : DbContext
    {
        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options) { }
        public virtual DbSet<Messages> messages { get; set; }
        public virtual DbSet<Friend> friends { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }
    }
}
