using AdriassengerApi.Repository.FriendRepo;
using AdriassengerApi.Repository.MessagesRepo;
using AdriassengerApi.Repository.NotificationsRepo;
using AdriassengerApi.Repository.UserRepo;

namespace AdriassengerApi.Repository
{
    public interface IUnitOfWork
    {
        IFriendRepository Friends { get; }
        IMessagesRepository Messages { get; }
        INotificationsRepository Notifications { get; }
        IUserRepository Users { get; }

        void Dispose();
        Task Save();
    }
}