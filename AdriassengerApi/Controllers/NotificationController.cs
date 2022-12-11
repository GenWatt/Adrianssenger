using AdriassengerApi.Data;
using AdriassengerApi.Models.Notifications;
using AdriassengerApi.Models.Responses;
using AdriassengerApi.Repository.NotificationsRepo;
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
        private readonly ApplicationContext _context;
        private readonly INotificationsRepository _notificationRepository;
        public NotificationController(ApplicationContext context, INotificationsRepository notificationsRepository)
        {
            _context = context;
            _notificationRepository = notificationsRepository;  
        }

        // GET: api/<NotificationController>
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<SuccessResponse<List<Notification>>>> Get()
        {
            var currentUser = UserManager.GetCurrentUser(HttpContext);
            if (currentUser is null) return Unauthorized("Can not send notifications user unauthorized");
            var notifications = await _context.Notifications.Where(n => n.UserId == currentUser.Id && n.Seen == false).OrderBy(n => n.CreatedAt).ToListAsync();

            return Ok(new SuccessResponse<List<Notification>> { Message = "Notifications sended", Data = notifications });
        }

        // POST api/<NotificationController>
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<SuccessResponse<string>>> Post([FromBody] Notification notification)
        {
            _notificationRepository.Add(notification);
            await _context.SaveChangesAsync();
            return Ok(new SuccessResponse<string> { Message = "Notification sent", Data = "" });
        }

        // DELETE api/<NotificationController>/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var notification = await _notificationRepository.GetById(id);

            if (notification is null)
            {
                return NotFound("Notification not found to delete");
            }

            _notificationRepository.Remove(notification);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
