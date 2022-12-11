using AdriassengerApi.Data;
using AdriassengerApi.Models.Notifications;

namespace AdriassengerApi.Repository.NotificationsRepo
{
    public class NotificationsRepository : Repository<Notification>, INotificationsRepository
    {
        private readonly ApplicationContext _context;
        public NotificationsRepository(ApplicationContext context) : base(context)
        {

        }
    }
}
