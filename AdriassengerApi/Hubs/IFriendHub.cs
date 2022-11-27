using AdriassengerApi.Models;
using AdriassengerApi.Utils;

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
    }
}