using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AdriassengerApi.Data;
using AdriassengerApi.Models;
using Microsoft.AspNetCore.Authorization;
using AdriassengerApi.Utils;
using AdriassengerApi.ViewModels;
using AdriassengerApi.Services;
using AdriassengerApi.Models.UserModels;
using AdriassengerApi.Repository.UserRepo;
using AdriassengerApi.Utils.Response;

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
        private readonly IStaticFiles _staticFiles;
        private readonly IUserRepository _userRepository;

        public UsersController(ApplicationContext context, IStaticFiles staticFiles, IUserRepository userRepository)
        {
            _context = context;
            _staticFiles = staticFiles;
            _userRepository = userRepository;
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

        // PUT: api/Users/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutUser(int id, [FromForm] EditUserView user)
        {
            var currentUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (currentUser == null) return NotFound();

            if (user.ProfilePicture is not null)
            {
                if (currentUser.AvatarUrl != "")
                {
                    await _staticFiles.DeleteAvatar(currentUser.AvatarUrl);
                }

                var response = await _staticFiles.SaveAvatar(user.ProfilePicture);
 
                if (response.Success) currentUser.AvatarUrl = response.Path;
            }

            _userRepository.Update(currentUser);
            await _userRepository.SaveAsync();
            
            return Ok(new SuccessResponse<UserWithoutCredentials> { Message = "Successfully edited user", Data = new UserWithoutCredentials(currentUser) });
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
