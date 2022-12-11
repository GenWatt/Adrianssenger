using AdriassengerApi.Models.UserModels;
using System.Security.Claims;

namespace AdriassengerApi.Services
{
    public class UserManager
    {
        static public UserViewWithId? GetCurrentUser(HttpContext context)
        {
            if (context.User == null) return null;
            return new UserViewWithId
            {
                Id = int.Parse(context.User.FindFirstValue(ClaimTypes.NameIdentifier)),
                UserName = context.User.FindFirstValue(ClaimTypes.Name),
                Email = context.User.FindFirstValue(ClaimTypes.Email),
            };
        }
    }
}
