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

        public IUserRepository Users => new UserRepository(_context);
        public INotificationsRepository Notifications => new NotificationsRepository(_context);
        public IMessagesRepository Messages => new MessagesRepository(_context);
        public IFriendRepository Friends => new FriendRepository(_context);

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
