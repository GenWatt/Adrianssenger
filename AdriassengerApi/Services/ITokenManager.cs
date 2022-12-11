using AdriassengerApi.Models.UserModels;
using System.Security.Claims;

namespace AdriassengerApi.Services
{
    public interface ITokenManager
    {
        string GenerateRefreshToken();
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
        string GetAccessToken(User user);
    }
}