using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AdriassengerApi.Data;
using AdriassengerApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using AdriassengerApi.Utils;
using Microsoft.AspNetCore.Identity;

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
        private readonly IConfiguration _configuration;

        public UsersController(IConfiguration config, ApplicationContext context)
        {
            _context = context;
            _configuration = config;
        }

        // GET: api/Users
        [HttpGet("Search")]
  
        public async Task<ActionResult<IEnumerable<SearchUser>>> Getusers(string searchText)
        {
          if (_context.users == null)
          {
              return NotFound();
          }
          
          var users = await _context.users.Where(s => s.Username!.Contains(searchText)).Select(u => new SearchUser() { Username = u.Username, Id = u.Id }).ToListAsync();

          return Ok(new Response<IEnumerable<SearchUser>>(true, "Users sended", users));
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> Getusers()
        {
            if (_context.users == null)
            {
                return NotFound();
            }
            return await _context.users.Include(u => u.Friends).ToListAsync();
        }

        // GET: api/Users/Login
        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<ActionResult<UserWithToken>> GetUser([FromBody] UserData userData)
        {
          if (_context.users == null)
          {
              return NotFound(new ValidationErrorResponse("User not found."));
          }
            try
            {
                var user = await _context.users.FirstOrDefaultAsync(u => u.Username == userData.Username);
                if (user == null)
                {
                    return BadRequest(new ValidationErrorResponse("User or password is invalid."));
                }

                if (!BCrypt.Net.BCrypt.Verify(userData.Password, user.Password))
                {
                    return BadRequest(new ValidationErrorResponse("User or password is invalid."));
                }

                //create claims details based on the user information
                var claims = new List<Claim> {
                        new Claim("id", user.Id.ToString()),
                        new Claim(ClaimTypes.Name, user.Username),
                        new Claim(ClaimTypes.Email, user.Email)
                    };
                var tokenService = new Token(_configuration);
                var token = tokenService.GetToken(claims);
                var refreshToken = tokenService.GenerateRefreshToken();

                user.RefreshToken = refreshToken;
                user.RefreshExpiration = DateTime.Now.AddMinutes(5);

                await _context.SaveChangesAsync();

                return Ok(new Response<UserWithToken>(true, "Succsess", new UserWithToken(user.Username, user.Id, token, refreshToken)));
            } catch
            {
                return BadRequest();
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("refresh")]
        public async Task<ActionResult<TokenApiModel>> Refresh(TokenApiModel tokenApiModel)
        {
            if (tokenApiModel is null) return BadRequest("Invalid client request");
            string accessToken = tokenApiModel.AccessToken;
            var tokenServices = new Token(_configuration);
            var principal = tokenServices.GetPrincipalFromExpiredToken(accessToken);
            if (principal == null) return BadRequest("Token is invalid");
            var username = principal.Identity.Name; //this is mapped to the Name claim by default

            try
            {
                var user = await _context.users.FirstOrDefaultAsync(u => u.Username == username);
                if (user is null || user.RefreshToken != tokenApiModel.RefreshToken || user.RefreshExpiration <= DateTime.Now)
                    return BadRequest("Invalid client request");

                var newAccessToken = tokenServices.GetToken(principal.Claims);
                var newRefreshToken = tokenServices.GenerateRefreshToken();

                user.RefreshToken = newRefreshToken;
                user.RefreshExpiration = DateTime.Now.AddMinutes(5);

                _context.SaveChanges();
                return Ok(new Response<TokenApiModel>(true, "Tokens created", new TokenApiModel()
                {
                    AccessToken = newAccessToken,
                    RefreshToken = newRefreshToken
                }));
            }
            catch
            {
                return BadRequest("Server problem");
            }
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
          if (_context.users == null)
          {
              return Problem("Entity set 'UserContext.users'  is null.");
          }
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            _context.users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (_context.users == null)
            {
                return NotFound();
            }
            var user = await _context.users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return (_context.users?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
