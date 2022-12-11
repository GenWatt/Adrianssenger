using AdriassengerApi.Models.Messages;
using AdriassengerApi.Models.Notifications;
using AdriassengerApi.Models.Friends;

namespace AdriassengerApi.Hubs
{
    public interface IFriendHub
    {
        Task OnConnectedAsync();
        Task SendFriendRequest(Notification notification);
        Task SendFriendRequestReject(Notification notification);
        Task SendFriendRequestAccept(FriendResponse user);
        Task RemoveNotification(int id);
        Task RemoveFriend(int id);
        Task SendMessage(Messages message);
        Task SeenMessage(int senderId, int messageId);
        Task ReciverSeenMessage(int id);
    }
}