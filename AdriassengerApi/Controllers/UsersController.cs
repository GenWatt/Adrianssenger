using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AdriassengerApi.Services;
using AdriassengerApi.Models.UserModels;
using AdriassengerApi.Models.Responses;
using AdriassengerApi.Repository;
using Microsoft.EntityFrameworkCore;
using AdriassengerApi.Data;

namespace AdriassengerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IStaticFiles _staticFiles;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ApplicationContext _context;

        public UsersController(IStaticFiles staticFiles, IUnitOfWork unitOfWork, ApplicationContext context)
        {
            _staticFiles = staticFiles;
            _unitOfWork = unitOfWork;
            _context = context;
        }

        // GET: api/Users
        [HttpGet("Search")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<SearchUser>>> GetSearchUsers(string searchText)
        {
            var currentUser = UserManager.GetCurrentUser(HttpContext);
            if (currentUser is null) return Unauthorized("User not log in");
            var users = await (from u in _context.Users
                               where u.Id != currentUser.Id && u.UserName.ToLower().Contains(searchText.ToLower()) &&
                               !_context.friends.Any(f => (currentUser.Id == f.UserId && f.SecondUserId == u.Id) || (f.UserId == u.Id && currentUser.Id == f.SecondUserId))
                               select new SearchUser { Id = u.Id, UserName = u.UserName }).ToArrayAsync();

            return Ok(new SuccessResponse<IEnumerable<SearchUser>> { Message = "Users sended", Data = users });
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutUser(int id, [FromForm] EditUserView user)
        {
            var currentUser = await _unitOfWork.Users.GetById(id);

            if (currentUser is null) return NotFound("Not found user to update");

            if (user.ProfilePicture is not null)
            {
                if (currentUser.AvatarUrl != "")
                {
                    await _staticFiles.DeleteAvatar(currentUser.AvatarUrl);
                }

                var response = await _staticFiles.SaveAvatar(user.ProfilePicture);
 
                if (response.Success) currentUser.AvatarUrl = response.Path;
            }

            _unitOfWork.Users.Update(currentUser);
            await _unitOfWork.Save();
            
            return Ok(new SuccessResponse<UserWithoutCredentials> { Message = "Successfully edited user", Data = new UserWithoutCredentials(currentUser) });
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _unitOfWork.Users.GetById(id);

            if (user is null)
            {
                return NotFound("Not found user to delete");
            }

            _unitOfWork.Users.Remove(user);
            await _unitOfWork.Save();

            return NoContent();
        }
    }
}
