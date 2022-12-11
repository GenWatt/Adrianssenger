using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AdriassengerApi.Data;
using AdriassengerApi.Hubs;
using Microsoft.AspNetCore.SignalR;
using AuthorizeAttribute = Microsoft.AspNetCore.Authorization.AuthorizeAttribute;
using AdriassengerApi.Repository.FriendRepo;
using AdriassengerApi.Repository.NotificationsRepo;
using AdriassengerApi.Services;
using AdriassengerApi.Models.Friends;
using AdriassengerApi.Models.Notifications;
using AdriassengerApi.Models.Responses;

namespace AdriassengerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendsController : ControllerBase
    {
        private readonly ApplicationContext _context;
        private readonly IHubContext<FriendHub, IFriendHub> _chatHub;
        private readonly IFriendRepository _friendRepository;
        private readonly INotificationsRepository _notificationRepository;
        public FriendsController(ApplicationContext context, 
                IHubContext<FriendHub, IFriendHub> chatHub, 
                IFriendRepository friendRepository, 
                INotificationsRepository notificationRepository)
        {
            _context = context;
            _chatHub = chatHub;
            _friendRepository = friendRepository;
            _notificationRepository = notificationRepository;   
        }

        // GET: api/Friends
        [HttpGet()]
        [Authorize]
        public async Task<ActionResult<IEnumerable<FriendResponse>>> GetFriend()
        {
            var currentUser = UserManager.GetCurrentUser(HttpContext);
            if (currentUser is null) return Unauthorized();

            var friends = await (from f in _context.friends
                        where (f.UserId == currentUser.Id || f.SecondUserId == currentUser.Id) && f.RequestAccepted == true
                        select new FriendResponse(f, f.User.Id == currentUser.Id ? f.SecondUser : f.User, 
                        (from m in _context.messages
                        where m.ReceiverId == currentUser.Id && m.Seen == false && m.SenderId == (f.User.Id == currentUser.Id ? f.SecondUserId : f.UserId)
                        select new { Message = m }).Count())).ToArrayAsync();

            return Ok(new SuccessResponse<IEnumerable<FriendResponse>> { Message = "Successfully fetched friends" , Data = friends });
        }

        // POST: api/Friends
        [HttpPost()]
        [Authorize]
        public async Task<ActionResult<Friend>> PostFriend(FriendView friend)
        {
            var newFriend = new Friend();
            var user = UserManager.GetCurrentUser(HttpContext);

            if (user is null) return Unauthorized();

            var isAlreadyFriend = await _context.friends.FirstOrDefaultAsync(f => f.SecondUserId == friend.SecondUserId && f.UserId == user.Id || f.UserId == friend.SecondUserId && f.SecondUserId == user.Id);

            if (isAlreadyFriend is not null) return Conflict("You are already friends");

            newFriend.UserId = user.Id;
            newFriend.SecondUserId = friend.SecondUserId;

            _friendRepository.Add(newFriend);

            await _friendRepository.SaveAsync();

            var notification = new Notification
            {
                Seen = false,
                Title = "Friend Request",
                Content = $"{user.UserName} wants to be your friend!",
                Type = NotificationType.INFO,
                Action = NotificationActions.ACCEPTORNOT,
                ActionType = NotificationActionType.FRIEND,
                UserId = newFriend.SecondUserId,
                AcceptUrl = FriendNotificationUrl.Accept,
                RejectUrl = FriendNotificationUrl.Reject,
                ActionId = newFriend.FriendId
            };

            _notificationRepository.Add(notification);

            await _context.SaveChangesAsync();
            await _chatHub.Clients.Group($"user_{friend.SecondUserId}").SendFriendRequest(notification);

            return CreatedAtAction("GetFriend", new { id = newFriend.FriendId }, friend);
        }
        // notification id
        [HttpPut("Accept/{id}")]
        [Authorize]
        public async Task<IActionResult> AcceptRequest(int id)
        {
            // Find curretn user, sender, and friendship data
            var data = await (from f in _context.friends 
                         join u1 in _context.Users on f.UserId equals u1.Id 
                         join u2 in _context.Users on f.SecondUserId equals u2.Id
                         where f.FriendId == id
                         select new { Friend = f, CurrentUser = u2, Sender = u1 }).FirstOrDefaultAsync(d => d.Friend.FriendId == id);
       
            if (data is not null && data.Friend is null) return NotFound("Not found friend data");
            data.Friend.RequestAccepted = true;

            _friendRepository.Update(data.Friend);
            var friendRequestNotification = await _context.Notifications.FirstOrDefaultAsync(n => n.ActionId == id);

            if (friendRequestNotification != null)
            {
               _notificationRepository.Remove(friendRequestNotification);
            }

             await _context.SaveChangesAsync();
             await _chatHub.Clients.Group($"user_{data.Friend.UserId}").SendFriendRequestAccept(new FriendResponse(data.Friend, data.CurrentUser));
             await _chatHub.Clients.Group($"user_{data.Friend.SecondUserId}").SendFriendRequestAccept(new FriendResponse(data.Friend, data.Sender));
          
            return Ok(new SuccessResponse<int> { Message = "Successfully friends request accepted" , Data = id});
        }
        // notification id
        [HttpDelete("Reject/{id}")]
        [Authorize]
        public async Task<IActionResult> RejectRequest(int id)
        {
            var friendData = await _context.friends.Include(f => f.SecondUser).FirstOrDefaultAsync(f => f.FriendId == id);
            if (friendData is null) return NotFound("Friend not found");

            _friendRepository.Remove(friendData);

            var friendRequestNotification = await _context.Notifications.FirstOrDefaultAsync(n => n.ActionId == id);

            if (friendRequestNotification != null)
            {
                _notificationRepository.Remove(friendRequestNotification);
            }

            var notification = new Notification
            {
                Title = "Friend rejection",
                Content = $"{friendData.SecondUser.UserName} reject your friend request!",
                UserId = friendData.UserId,
            };

            _notificationRepository.Add(notification);
            await _context.SaveChangesAsync();
            await _chatHub.Clients.Group($"user_{friendData.UserId}").SendFriendRequestReject(notification);
            if (friendRequestNotification is not null) await _chatHub.Clients.Group($"user_{friendData.SecondUserId}").RemoveNotification(friendRequestNotification.Id);

            return Ok(new SuccessResponse<int> {  Message = "Friends request rejected!", Data = id});
        }

        // DELETE: api/Friends/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteFriend(int id)
        {
            var friend = await _friendRepository.GetById(id);

            if (friend is null)
            {
                return NotFound("Friend not found to delete");
            }

            _friendRepository.Remove(friend);

            await _context.SaveChangesAsync();
            await _chatHub.Clients.Group($"user_{friend.SecondUserId}").RemoveFriend(id);
            await _chatHub.Clients.Group($"user_{friend.UserId}").RemoveFriend(id);

            return NoContent();
        }
    }
}
