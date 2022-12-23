using AdriassengerApi.Data;
using AdriassengerApi.Repository.FriendRepo;
using AdriassengerApi.Repository.MessagesRepo;
using AdriassengerApi.Repository.NotificationsRepo;
using AdriassengerApi.Repository.UserRepo;

namespace AdriassengerApi.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationContext _context;

        public UnitOfWork(ApplicationContext context)
        {
            _context = context;
        }

        private IUserRepository _users;
        public IUserRepository Users => _users ?? new UserRepository(_context);
        private INotificationsRepository _notifications;
        public INotificationsRepository Notifications => _notifications ?? new NotificationsRepository(_context);
        private IMessagesRepository _messages;
        public IMessagesRepository Messages => _messages ?? new MessagesRepository(_context);
        private IFriendRepository _friends;
        public IFriendRepository Friends => _friends ?? new FriendRepository(_context);

        public async Task Save()
        {
            await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
