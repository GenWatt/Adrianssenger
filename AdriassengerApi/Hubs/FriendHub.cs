using AdriassengerApi.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace AdriassengerApi.Hubs
{
    public class FriendHub : Hub<IFriendHub>
    {
        [AllowAnonymous]
        public override async Task OnConnectedAsync()
        {
            var user = UserManager.GetCurrentUser(Context.GetHttpContext());
            if (user == null) await base.OnConnectedAsync();
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{user.Id}");
            await base.OnConnectedAsync();
        }
    }
}
