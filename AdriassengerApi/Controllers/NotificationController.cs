using AdriassengerApi.Data;
using AdriassengerApi.Models;
using AdriassengerApi.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AdriassengerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public NotificationController(ApplicationContext context)
        {
            _context = context;
        }

        // GET: api/<NotificationController>
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List<Notification>>> Get()
        {
            var currentUser = UserManager.GetCurrentUser(HttpContext);
            if (currentUser == null) return Unauthorized("Can not send notifications user unauthorized");
            var notifications = await _context.Notifications.Where(n => n.UserId == currentUser.Id && n.Seen == false).OrderBy(n => n.CreatedAt).ToListAsync();

            return Ok(new Response<List<Notification>>(true, "Notifications sended", notifications));
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<Notification>> Seen(int id)
        {
            var notification = await _context.Notifications.FirstOrDefaultAsync(n => n.Id == id);
            _context.Entry(notification).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(new Response<Notification>(true, "Notifications sended", notification));
        }

        // GET api/<NotificationController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<NotificationController>
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Response<string>>> Post([FromBody] Notification notification)
        {
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
            return Ok(new Response<string>(true, "Notification sent", ""));
        }

        // PUT api/<NotificationController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<NotificationController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
