﻿using AdriassengerApi.Data;
using AdriassengerApi.Hubs;
using AdriassengerApi.Models;
using AdriassengerApi.Utils;
using AdriassengerApi.Utils.Response;
using AdriassengerApi.ViewModels;
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

        public MessagesController(ApplicationContext context, IHubContext<FriendHub, IFriendHub> chatHub)
        {
            _context = context;
            _chatHub = chatHub;
        }

        // GET api/<Messages>?userId=5&receiverId=4
        [HttpGet()]
        [Authorize]
        public async Task<ActionResult<Response<List<Messages>>>> Get(int userId, int receiverId)
        {
            var messages = await _context.messages.Where(m => (m.SenderId == userId && m.ReceiverId == receiverId) || (m.SenderId == receiverId && m.ReceiverId == userId)).OrderBy(m => m.CreatedAt).ToListAsync();
            return new Response<List<Messages>>(true, "Successfully recvied massages", messages);
        }

        // POST api/<MessagesController>
        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Post([FromBody] MessageView message)
        {
            var errorHandler = new ErrorHandler();
            var user = UserManager.GetCurrentUser(HttpContext);

            if (user is null)
            {
                errorHandler.AddError(new ApiError { ErrorMessage = "You are unauthorized", Type = ApiErrorType.Auth });
                return Unauthorized(new ErrorReponse<List<ApiError>> { Errors = errorHandler.GetErrors() });
            }

            var newMessage = new Messages
            {
                Message = message.Message,
                ReceiverId = message.ReceiverId,
                SenderId = user.Id
            };
            var friendData = await _context.friends.FirstOrDefaultAsync(f => (f.UserId == message.ReceiverId && f.SecondUserId == user.Id) || (f.SecondUserId == message.ReceiverId && f.UserId == user.Id));

            if (friendData is not null)
            {
                friendData.LastMessage = message.Message;
                _context.Entry(friendData).State = EntityState.Modified;
            }

            _context.Add(newMessage);
            await _context.SaveChangesAsync();
            await _chatHub.Clients.Group($"user_{message.ReceiverId}").SendMessage(newMessage);
            await _chatHub.Clients.Group($"user_{user.Id}").SendMessage(newMessage);

            return Ok(new SuccessResponse<Messages> { Message = "Successfully created message" , Data = newMessage });
        }

        // PUT api/<MessagesController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<MessagesController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
