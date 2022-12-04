using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AdriassengerApi.Data;
using AdriassengerApi.Models;
using AdriassengerApi.Utils;
using AdriassengerApi.Hubs;
using Microsoft.AspNetCore.SignalR;
using AuthorizeAttribute = Microsoft.AspNetCore.Authorization.AuthorizeAttribute;
using AdriassengerApi.Exceptions.ErrorService;
using AdriassengerApi.Exceptions;

namespace AdriassengerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendsController : ControllerBase
    {
        private readonly ApplicationContext _context;
        private readonly IHubContext<FriendHub, IFriendHub> _chatHub;
        private readonly IErrorService _errorService;
        public FriendsController(ApplicationContext context, IHubContext<FriendHub, IFriendHub> chatHub, IErrorService errorService)
        {
            _context = context;
            _chatHub = chatHub;
            _errorService = errorService;
        }

        // GET: api/Friends
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Friend>>> Getfriends()
        {
            return await _context.friends.Include(u => u.User).ToListAsync();
        }

        // GET: api/Friends/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<FriendResponse>>> GetFriend(int id)
        {
            var friendContext = _context.friends;
            var friends1 = await friendContext
                .Where(f => f.UserId == id && f.RequestAccepted == true)
                .Include(f => f.SecondUser)
                .Select(f => new FriendResponse(f, f.SecondUser))
                .ToListAsync();
            var friends2 = await friendContext
                .Where(f => f.SecondUserId == id && f.RequestAccepted == true)
                .Include(f => f.User)
                .Select(f => new FriendResponse(f, f.User))
                .ToListAsync();

            var friends = friends1.Concat(friends2);

            return Ok(new Response<IEnumerable<FriendResponse>>(true, "Successfully fetched friends", friends));
        }

        // PUT: api/Friends/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFriend(int id, Friend friend)
        {
            if (id != friend.FriendId)
            {
                return BadRequest();
            }

            _context.Entry(friend).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FriendExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Friends
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost()]
        [Authorize]
        public async Task<ActionResult<Friend>> PostFriend(FriendView friend)
        {
            var newFriend = new Friend();
            var user = UserManager.GetCurrentUser(HttpContext);

            if (user == null) return Unauthorized(_errorService.AddError(new UnauthorizedError()).GetErrorResponse());

            var isAlreadyFriend = await _context.friends.FirstOrDefaultAsync(f => f.SecondUserId == friend.SecondUserId && f.UserId == user.Id || f.UserId == friend.SecondUserId && f.SecondUserId == user.Id);

            if (isAlreadyFriend != null) return BadRequest(_errorService.AddError(new FriendsAlreadyExistsError()).GetErrorResponse());

            newFriend.UserId = user.Id;
            newFriend.SecondUserId = friend.SecondUserId;

            _context.friends.Add(newFriend);

            await _context.SaveChangesAsync();

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

            _context.Notifications.Add(notification);

            await _context.SaveChangesAsync();
            await _chatHub.Clients.Group($"user_{friend.SecondUserId}").SendFriendRequest(notification);

            return CreatedAtAction("GetFriend", new { id = newFriend.FriendId }, friend);
        }
        // notification id
        [HttpPut("Accept/{id}")]
        [Authorize]
        public async Task<IActionResult> AcceptRequest(int id)
        {
            var data = await (from f in _context.friends 
                         join u1 in _context.Users on f.UserId equals u1.Id 
                         join u2 in _context.Users on f.SecondUserId equals u2.Id
                         where f.FriendId == id
                         select new { Friend = f, CurrentUser = u2, Sender = u1 }).FirstOrDefaultAsync(d => d.Friend.FriendId == id);
               
            if (data == null) return NotFound(new Response<string>(false, "request not found", ""));
            data.Friend.RequestAccepted = true;

            _context.Entry(data.Friend).State = EntityState.Modified;
            var friendRequestNotification = await _context.Notifications.FirstOrDefaultAsync(n => n.ActionId == id);

            if (friendRequestNotification != null)
            {
                _context.Notifications.Remove(friendRequestNotification);
            }

            try
            {
                await _context.SaveChangesAsync();
                await _chatHub.Clients.Group($"user_{data.Friend.UserId}").SendFriendRequestAccept(new FriendResponse(data.Friend, data.CurrentUser));
                await _chatHub.Clients.Group($"user_{data.Friend.SecondUserId}").SendFriendRequestAccept(new FriendResponse(data.Friend, data.Sender));
            } catch
            {
                return BadRequest(new Response<string>(false, "Server error", ""));
            }            

            return Ok(new Response<int>(true, "Successfully friends request accepted", id));
        }

        [HttpDelete("Reject/{id}")]
        [Authorize]
        public async Task<IActionResult> RejectRequest(int id)
        {
            var friendData = await _context.friends.Include(f => f.SecondUser).FirstOrDefaultAsync(f => f.FriendId == id);
            if (friendData == null) return NotFound(new Response<string>(false, "request not found", ""));

            _context.friends.Remove(friendData);

            var friendRequestNotification = await _context.Notifications.FirstOrDefaultAsync(n => n.ActionId == id);

            if (friendRequestNotification != null)
            {
                _context.Notifications.Remove(friendRequestNotification);
            }

            try
            {
                var notification = new Notification
                {
                    Title = "Friend rejection",
                    Content = $"{friendData.SecondUser.UserName} reject your friend request!",
                    UserId = friendData.UserId,
                };

                _context.Notifications.Add(notification);
                await _context.SaveChangesAsync();
                await _chatHub.Clients.Group($"user_{friendData.UserId}").SendFriendRequestReject(notification);
                if (friendRequestNotification != null) await _chatHub.Clients.Group($"user_{friendData.SecondUserId}").RemoveNotification(friendRequestNotification.Id);
            }
            catch (DbUpdateConcurrencyException)
            {
                return BadRequest(new Response<string>(false, "Server error", ""));
            }

            return Ok(new Response<int>(true, "Friends request rejected!", id));
        }

        // DELETE: api/Friends/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteFriend(int id)
        {
            var friend = await _context.friends.FirstOrDefaultAsync(f => f.FriendId == id);

            if (friend == null)
            {
                return NotFound("Friend not found to delete");
            }

            _context.friends.Remove(friend);
            await _context.SaveChangesAsync();

            var currentUserId = UserManager.GetCurrentUser(HttpContext).Id;
            await _chatHub.Clients.Group($"user_{currentUserId}").RemoveFriend(id);

            return NoContent();
        }

        private bool FriendExists(int id)
        {
            return _context.friends.Any(e => e.FriendId == id);
        }
    }
}
