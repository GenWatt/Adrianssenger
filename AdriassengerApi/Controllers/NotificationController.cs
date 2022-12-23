using AdriassengerApi.Models.Notifications;
using AdriassengerApi.Models.Responses;
using AdriassengerApi.Repository;
using AdriassengerApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AdriassengerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public NotificationController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;  
        }

        // GET: api/<NotificationController>
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<SuccessResponse<List<Notification>>>> Get()
        {
            var currentUser = UserManager.GetCurrentUser(HttpContext);
            if (currentUser is null) return Unauthorized("Can not send notifications user unauthorized");
            var notifications = await _unitOfWork.Notifications.GetWhere(n => n.UserId == currentUser.Id && n.Seen == false).OrderBy(n => n.CreatedAt).ToListAsync();

            return Ok(new SuccessResponse<List<Notification>> { Message = "Notifications sended", Data = notifications });
        }

        // POST api/<NotificationController>
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<SuccessResponse<string>>> Post([FromBody] Notification notification)
        {
            _unitOfWork.Notifications.Add(notification);
            await _unitOfWork.Save();
            return Ok(new SuccessResponse<string> { Message = "Notification sent", Data = "" });
        }

        // DELETE api/<NotificationController>/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var notification = await _unitOfWork.Notifications.GetById(id);

            if (notification is null)
            {
                return NotFound("Notification not found to delete");
            }

            _unitOfWork.Notifications.Remove(notification);
            await _unitOfWork.Save();

            return NoContent();
        }
    }
}
