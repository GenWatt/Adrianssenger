using AdriassengerApi.Data;
using AdriassengerApi.Models;
using AdriassengerApi.Models.UserModels;
using AdriassengerApi.Utils;
using AdriassengerApi.Utils.Response;
using AdriassengerApi.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;

namespace AdriassengerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : Controller
    {
        private readonly ApplicationContext _context;
        private readonly IConfiguration _config;
        private readonly ITokenManager _tokenManager;
        public AccountController(ApplicationContext context, IConfiguration config, ITokenManager tokenManager)
        {
            _context = context;
            _config = config;
            _tokenManager = tokenManager;
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<ActionResult<SuccessResponse<User>>> Register(UserView model)
        {
            if (ModelState.IsValid)
            {
                var userExists = await _context.Users.FirstOrDefaultAsync(u => u.UserName == model.UserName || u.Email == model.Email);

                if (userExists != null)
                {
                    ModelState.AddModelError("", "User already exists");
                    return BadRequest(new ErrorReponse<IEnumerable<ModelError>> { Errors = ModelState.Values.SelectMany(v => v.Errors) });
                }

                var user = new User
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    Password = BCrypt.Net.BCrypt.HashPassword(model.Password)
                };
                
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return new SuccessResponse<User> { Message = "Successfully registered", Data = user };
            }
            return BadRequest(new ErrorReponse<IEnumerable<ModelError>> { Errors = ModelState.Values.SelectMany(v => v.Errors) });
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<ActionResult<SuccessResponse<UserWithoutCredentials>>> Login(LoginView user)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var currentUser = await GetUserFromCredentials(user);

                    if (currentUser == null)
                    {
                        ModelState.AddModelError("", "Invalid Login attempt.");
                        return BadRequest(new ErrorReponse<IEnumerable<ModelError>> { Errors = ModelState.Values.SelectMany(v => v.Errors) });
                    }

                    currentUser.AccessToken = _tokenManager.GetAccessToken(currentUser);
                    currentUser.RefreshToken = _tokenManager.GenerateRefreshToken();
                    currentUser.RefreshTokenExpirationDate = DateTime.Now.AddMinutes(5);
                    currentUser.IsAccessTokenValid = true;

                    Response.Cookies.Append("AccessToken", currentUser.AccessToken, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.None, IsEssential = true });
                    Response.Cookies.Append("RefreshToken", currentUser.RefreshToken, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.None, IsEssential = true });
                    
                    _context.Entry(currentUser).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
                    return new SuccessResponse<UserWithoutCredentials> { Message = "Successfully log in", Data = new UserWithoutCredentials(currentUser) };
                }
                return BadRequest(new ErrorReponse<IEnumerable<ModelError>> { Errors = ModelState.Values.SelectMany(v => v.Errors) });
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        private async Task<User?> GetUserFromCredentials(LoginView user)
        {
            var currentUser = await _context.Users.FirstOrDefaultAsync(u => u.UserName == user.UserName);

            if (currentUser != null && BCrypt.Net.BCrypt.Verify(user.Password, currentUser.Password)) return currentUser;

            return currentUser;
        }
        [HttpPost("Refresh")]
        [AllowAnonymous]
        public async Task<ActionResult<SuccessResponse<string>>> RefreshToken()
        {
            if (Request.Cookies.ContainsKey("AccessToken") && Request.Cookies.ContainsKey("RefreshToken"))
            {
                var refreshToken = Request.Cookies["RefreshToken"];
                var currentUser = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

                if (currentUser is not null && currentUser.RefreshTokenExpirationDate > DateTime.Now)
                {
                    var newAccessToken = _tokenManager.GetAccessToken(currentUser);
                    var newRefreshToken = _tokenManager.GenerateRefreshToken();

                    currentUser.RefreshToken = newRefreshToken;
                    currentUser.AccessToken = newAccessToken;
                    currentUser.RefreshTokenExpirationDate = DateTime.Now.AddMinutes(20);
                    currentUser.IsAccessTokenValid = true;

                    Response.Cookies.Append("AccessToken", currentUser.AccessToken, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.None, IsEssential = true });
                    Response.Cookies.Append("RefreshToken", currentUser.RefreshToken, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.None, IsEssential = true });

                    _context.Entry(currentUser).State = EntityState.Modified;
                    await _context.SaveChangesAsync();

                    return Ok(new SuccessResponse<string> { Data = "Refresh Token", Message = "Success" });
                }

                return Unauthorized();
            }
            return Unauthorized();
        }
 
        [HttpGet("Logout")]
        [Authorize]
        public async Task<IActionResult> Logout() 
        {
            if (Request.Cookies.ContainsKey("AccessToken"))
            {
                var currentUser = await _context.Users.FirstOrDefaultAsync(u => u.AccessToken == Request.Cookies["AccessToken"]);

                if (currentUser is null) return Unauthorized();

                currentUser.AccessToken = "";
                currentUser.RefreshToken = "";
                currentUser.RefreshTokenExpirationDate = DateTime.Now.AddMinutes(-20);
                currentUser.IsAccessTokenValid = false;

                _context.Entry(currentUser).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new SuccessResponse<string> { Data = "Log out", Message = "Successully log out"});
            }
            return Unauthorized();
        }   
    }
}
