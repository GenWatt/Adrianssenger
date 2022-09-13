using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AdriassengerApi.Data;
using AdriassengerApi.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using AdriassengerApi.Utils;

public class UserData
{
    public string Username { get; set; }
    public string Password { get; set; }

}

public class Response<T>
{
    public bool Success { get; set; }   
    public string Message { get; set; }
    public T Data { get; set; }

    public Response(bool success, string message, T data)
    {
        Success = success;
        Message = message;
        Data = data;
    }   
}

public class UserWithToken
{
    public string Username { get; set; }
    public int Id  { get; set; }
    public string Token { get; set; }

    public UserWithToken(string username, int id, string token)
    {
        Username = username;
        Id = id;
        Token = token;
    }
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
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<User>>> Getusers()
        {
          if (_context.users == null)
          {
              return NotFound();
          }
            return await _context.users.ToListAsync();
        }

        // GET: api/Users/Login
        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<ActionResult<UserWithToken>> GetUser(UserData userData)
        {
          if (_context.users == null)
          {
              return NotFound();
          }
            var userList = await _context.users.Where(u => u.Username == userData.Username && u.Password == userData.Password).ToListAsync();
            if (userList.Count == 0)
            {
                return NotFound();
            }

            var user = userList[0];

            //create claims details based on the user information
            var claims = new[] {
                        new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                        new Claim("Id", user.Id.ToString()),
                        new Claim("Username", user.Username),
                        new Claim("Email", user.Email)
                    };
            var token = new Token(_configuration).GetToken(claims);

            return Ok(new Response<UserWithToken>(true, "Succsess", new UserWithToken(user.Username, user.Id, token)));
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
        public async Task<ActionResult<User>> PostUser(User user)
        {
          if (_context.users == null)
          {
              return Problem("Entity set 'UserContext.users'  is null.");
          }
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
