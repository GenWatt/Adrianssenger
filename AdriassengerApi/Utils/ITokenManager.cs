using AdriassengerApi.Models;
using System.Security.Claims;

namespace AdriassengerApi.Utils
{
    public interface ITokenManager
    {
        string GenerateRefreshToken();
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
        string GetAccessToken(User user);
    }
}