using AdriassengerApi.Hubs;
using AdriassengerApi.Models.Messages;
using AdriassengerApi.Models.Responses;
using AdriassengerApi.Repository;
using AdriassengerApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace AdriassengerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IHubContext<FriendHub, IFriendHub> _chatHub;
        private readonly IUnitOfWork _unitOfWork;
        public MessagesController(IHubContext<FriendHub, IFriendHub> chatHub, IUnitOfWork unitOfWork)
        {
            _chatHub = chatHub;
            _unitOfWork = unitOfWork;
        }

        // GET api/<Messages>?userId=5&receiverId=4
        [HttpGet()]
        [Authorize]
        public async Task<ActionResult<SuccessResponse<List<Messages>>>> Get(int userId, int receiverId)
        {
            var messages = await _unitOfWork.Messages.GetWhere(IsUsersMessage(userId, receiverId))
                .OrderBy(m => m.CreatedAt).ToListAsync();
            return Ok(new SuccessResponse<List<Messages>> { Message = "Successfully recvied massages", Data = messages });
        }

        private static Expression<Func<Messages, bool>> IsUsersMessage(int userId, int receiverId)
        {
            return m => (m.SenderId == userId && m.ReceiverId == receiverId) || (m.SenderId == receiverId && m.ReceiverId == userId);
        }

        [HttpGet("Unseen")]
        [Authorize]
        public async Task<ActionResult<SuccessResponse<List<Messages>>>> GetUnseenMessages()
        {
            var currentUser = UserManager.GetCurrentUser(HttpContext);

            if (currentUser is null) return Unauthorized();

            var messages = await _unitOfWork.Messages.GetWhere(m => m.ReceiverId == currentUser.Id && !m.Seen)
                .OrderBy(m => m.CreatedAt).ToListAsync();

            return Ok(new SuccessResponse<List<Messages>> { Message = "Successfully recvied massages", Data = messages });
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Post([FromBody] MessageView message)
        {
            var user = UserManager.GetCurrentUser(HttpContext);

            if (user is null)
            {
                return Unauthorized();
            }

            var newMessage = new Messages
            {
                Message = message.Message,
                ReceiverId = message.ReceiverId,
                SenderId = user.Id,
            };
            var friendData = await _unitOfWork.Friends.FindOne(f => (f.UserId == message.ReceiverId && f.SecondUserId == user.Id) || (f.SecondUserId == message.ReceiverId && f.UserId == user.Id));

            if (friendData is null)
            {
                return NotFound("Not found friend");
            }

            friendData.LastMessage = message.Message;
            _unitOfWork.Friends.Update(friendData);
            _unitOfWork.Messages.Add(newMessage);

            await _unitOfWork.Save();
            await _chatHub.Clients.Group($"user_{message.ReceiverId}").SendMessage(newMessage);
            await _chatHub.Clients.Group($"user_{user.Id}").SendMessage(newMessage);

            return Ok(new SuccessResponse<Messages> { Message = "Successfully created message" , Data = newMessage });
        }

        [HttpPut("Seen/{id}")]
        [Authorize]
        public async Task Put(int id)
        {
            var message = await _unitOfWork.Messages.FindOne(m => m.Id == id && m.Seen == false);

            if (message is not null)
            {
                message.Seen = true;

                _unitOfWork.Messages.Update(message);

                await _unitOfWork.Save();
                await _chatHub.Clients.Groups($"user_{message.ReceiverId}").SeenMessage(message.SenderId, message.Id);
                await _chatHub.Clients.Groups($"user_{message.SenderId}").ReciverSeenMessage(message.Id);
                Ok();
            }

            NotFound("Not found unseen message");
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var messageToDelete = await _unitOfWork.Messages.GetById(id);

            if (messageToDelete is null)
            {
                return NotFound("Not found message to delete");
            }

            _unitOfWork.Messages.Remove(messageToDelete);

            await _unitOfWork.Save();

            return NoContent();
        }
    }
}
