using AdriassengerApi.Data;
using AdriassengerApi.Hubs;
using AdriassengerApi.Models.Messages;
using AdriassengerApi.Models.Responses;
using AdriassengerApi.Repository.FriendRepo;
using AdriassengerApi.Repository.MessagesRepo;
using AdriassengerApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace AdriassengerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly ApplicationContext _context;
        private readonly IHubContext<FriendHub, IFriendHub> _chatHub;
        private readonly IMessagesRepository _messagesRepository;
        private readonly IFriendRepository _friendRepository;
        public MessagesController(ApplicationContext context, IHubContext<FriendHub, IFriendHub> chatHub, IMessagesRepository messagesRepository, IFriendRepository friendRepository)
        {
            _context = context;
            _chatHub = chatHub;
            _messagesRepository = messagesRepository;
            _friendRepository = friendRepository;   
        }

        // GET api/<Messages>?userId=5&receiverId=4
        [HttpGet()]
        [Authorize]
        public async Task<ActionResult<SuccessResponse<List<Messages>>>> Get(int userId, int receiverId)
        {
            var messages = await _context.messages.Where(m => (m.SenderId == userId && m.ReceiverId == receiverId) || (m.SenderId == receiverId && m.ReceiverId == userId)).OrderBy(m => m.CreatedAt).ToListAsync();
            return Ok(new SuccessResponse<List<Messages>> { Message = "Successfully recvied massages", Data = messages });
        }

        [HttpGet("Unseen")]
        [Authorize]
        public async Task<ActionResult<SuccessResponse<List<Messages>>>> GetUnseenMessages()
        {
            var currentUser = UserManager.GetCurrentUser(HttpContext);

            if (currentUser is null) return Unauthorized();

            var messages = await _context.messages.Where(m => m.ReceiverId == currentUser.Id && !m.Seen).OrderBy(m => m.CreatedAt).ToListAsync();

            return Ok(new SuccessResponse<List<Messages>> {  Message = "Successfully recvied massages", Data = messages });
        }

        // POST api/<MessagesController>
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
            var friendData = await _context.friends.FirstOrDefaultAsync(f => (f.UserId == message.ReceiverId && f.SecondUserId == user.Id) || (f.SecondUserId == message.ReceiverId && f.UserId == user.Id));

            if (friendData is null)
            {
                return NotFound("Not found friend");
            }

            friendData.LastMessage = message.Message;
            _friendRepository.Update(friendData);
            _messagesRepository.Add(newMessage);

            await _context.SaveChangesAsync();
            await _chatHub.Clients.Group($"user_{message.ReceiverId}").SendMessage(newMessage);
            await _chatHub.Clients.Group($"user_{user.Id}").SendMessage(newMessage);

            return Ok(new SuccessResponse<Messages> { Message = "Successfully created message" , Data = newMessage });
        }

        [HttpPut("Seen/{id}")]
        [Authorize]
        public async Task Put(int id)
        {
            var message = await _context.messages.FirstOrDefaultAsync(m => m.Id == id && m.Seen == false);

            if (message is not null)
            {
                message.Seen = true;

                _messagesRepository.Update(message);

                await _context.SaveChangesAsync();
                await _chatHub.Clients.Groups($"user_{message.ReceiverId}").SeenMessage(message.SenderId, message.Id);
                await _chatHub.Clients.Groups($"user_{message.SenderId}").ReciverSeenMessage(message.Id);
                Ok();
            }

            NotFound("Not found unseen message");
        }

        // DELETE api/<MessagesController>/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var messageToDelete = await _messagesRepository.GetById(id);

            if (messageToDelete is null)
            {
                return NotFound("Not found message to delete");
            }

            _messagesRepository.Remove(messageToDelete);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
