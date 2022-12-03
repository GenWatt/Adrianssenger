using AdriassengerApi.Data;
using AdriassengerApi.Models;
using AdriassengerApi.Models.UserModels;
using AdriassengerApi.Repository.UserRepo;
using AdriassengerApi.Services;
using AdriassengerApi.Utils.Response;
using AdriassengerApi.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace AdriassengerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : Controller
    {
        private readonly ApplicationContext _context;
        private readonly ITokenManager _tokenManager;
        private readonly IUserRepository _userRepository;
        private readonly IStaticFiles _staticFiles;
        private readonly IConfiguration _config;

        public AccountController(ApplicationContext context, ITokenManager tokenManager, IUserRepository userRepository, IStaticFiles staticFiles, IConfiguration config)
        {
            _context = context;
            _tokenManager = tokenManager;
            _userRepository = userRepository;
            _staticFiles = staticFiles;
            _config = config;
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<ActionResult<SuccessResponse<User>>> Register([FromForm] UserView model)
        {
            if (ModelState.IsValid)
            {
                var userExists = await _context.Users.FirstOrDefaultAsync(u => u.UserName == model.UserName || u.Email == model.Email);

                if (userExists != null)
                {
                    ModelState.AddModelError("userName", "User already exists");
                    return BadRequest(new ErrorReponse<IEnumerable<ModelError>> { Errors = ModelState.Values.SelectMany(v => v.Errors) });
                }

                var user = new User
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    Password = BCrypt.Net.BCrypt.HashPassword(model.Password)
                };

                if (model.ProfilePicture is not null)
                {
                    var response = await _staticFiles.SaveAvatar(model.ProfilePicture);

                    if (response.Success) user.AvatarUrl = response.Path;
                }

                _userRepository.Add(user);
                await _userRepository.SaveAsync();

                return new SuccessResponse<User> { Message = "Successfully registered", Data = user };
            }
            return BadRequest(new ErrorReponse<IEnumerable<ModelError>> { Errors = ModelState.Values.SelectMany(v => v.Errors) });
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<ActionResult<SuccessResponse<UserWithoutCredentials>>> Login(LoginView user)
        {
            if (ModelState.IsValid)
            {
                var currentUser = await GetUserFromCredentials(user);

                if (currentUser == null)
                {
                    ModelState.AddModelError("", "Invalid Login attempt.");
                    return Conflict(new ErrorReponse<IEnumerable<ModelError>> { Errors = ModelState.Values.SelectMany(v => v.Errors) });
                }

                var accessToken = _tokenManager.GetAccessToken(currentUser);
                var refreshToken = _tokenManager.GenerateRefreshToken();

                currentUser.AccessToken = accessToken;
                currentUser.RefreshToken = refreshToken;
                currentUser.RefreshTokenExpirationDate = DateTime.Now.AddMinutes(double.Parse(_config["Jwt:RefreshTokenExpiration"]));
                currentUser.IsAccessTokenValid = true;

                SetTokensToCookies(accessToken, refreshToken);

                _userRepository.Update(currentUser);
                await _userRepository.SaveAsync();

                return Ok(new SuccessResponse<UserWithoutCredentials> { Message = "Successfully log in", Data = new UserWithoutCredentials(currentUser) });
            }
            return BadRequest(new ErrorReponse<IEnumerable<ModelError>> { Errors = ModelState.Values.SelectMany(v => v.Errors) });
        }

        private async Task<User?> GetUserFromCredentials(LoginView user)
        {
            var currentUser = await _userRepository.GetByUsername(user.UserName);

            if (currentUser != null && BCrypt.Net.BCrypt.Verify(user.Password, currentUser.Password)) return currentUser;

            return currentUser;
        }
        [HttpPost("Refresh")]
        [AllowAnonymous]
        public async Task<ActionResult<SuccessResponse<string>>> RefreshToken()
        {
            var refreshToken = Request.Cookies["RefreshToken"];
            var currentUser = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

            if (refreshToken is not null && currentUser is not null && currentUser.RefreshTokenExpirationDate > DateTime.Now)
            {
                var newAccessToken = _tokenManager.GetAccessToken(currentUser);
                var newRefreshToken = _tokenManager.GenerateRefreshToken();

                currentUser.RefreshToken = newRefreshToken;
                currentUser.AccessToken = newAccessToken;
                currentUser.RefreshTokenExpirationDate = DateTime.Now.AddMinutes(double.Parse(_config["Jwt:RefreshTokenExpiration"]));
                currentUser.IsAccessTokenValid = true;

                SetTokensToCookies(newAccessToken, newRefreshToken);

                _userRepository.Update(currentUser);
                await _userRepository.SaveAsync();

                return Ok(new SuccessResponse<string> { Data = "Refresh Token", Message = "Success" });
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
                currentUser.RefreshTokenExpirationDate = DateTime.Now.AddDays(-20);
                currentUser.IsAccessTokenValid = false;

                SetTokensToCookies("", "");

                _userRepository.Update(currentUser);
                await _userRepository.SaveAsync();

                return Ok(new SuccessResponse<string> { Data = "Log out", Message = "Successully log out"});
            }
            return Unauthorized();
        }   

        private void SetTokensToCookies(string accessToken, string refreshToken)
        {
            Response.Cookies.Append("AccessToken", accessToken, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.None, IsEssential = true });
            Response.Cookies.Append("RefreshToken", refreshToken, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.None, IsEssential = true });
        }
    }
}
