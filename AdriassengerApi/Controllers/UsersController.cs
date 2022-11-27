using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AdriassengerApi.Data;
using AdriassengerApi.Models;
using Microsoft.AspNetCore.Authorization;
using AdriassengerApi.Utils;
using System.Security.Claims;

public class FriendWithId
{
    public int FriendId { get; set; }
}

namespace AdriassengerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public UsersController(ApplicationContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet("Search")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<SearchUser>>> GetSearchUsers(string searchText)
        {
            var currentUser = UserManager.GetCurrentUser(HttpContext);
            if (currentUser == null) return Unauthorized("User not log in");
            var users = await (from u in _context.Users
                        where u.Id != currentUser.Id && u.UserName.Contains(searchText) &&
                        !_context.friends.Any(f => (currentUser.Id == f.UserId && f.SecondUserId == u.Id) || (f.UserId == u.Id && currentUser.Id == f.SecondUserId))
                        select new SearchUser { Id = u.Id, UserName = u.UserName }).ToArrayAsync();

            return Ok(new Response<IEnumerable<SearchUser>>(true, "Users sended", users));
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> Getusers()
        {
            if (_context.Users == null)
            {
                return NotFound();
            }
            return await _context.Users.Include(u => u.Friends).ToListAsync();
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<User>> PostUser(User user)
        {
          if (_context.Users == null)
          {
              return Problem("Entity set 'UserContext.users'  is null.");
          }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (_context.Users == null)
            {
                return NotFound();
            }
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return (_context.Users?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
