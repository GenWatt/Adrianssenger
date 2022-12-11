using System.ComponentModel.DataAnnotations.Schema;
using AdriassengerApi.Models.Friends;

namespace AdriassengerApi.Models.UserModels
{
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string AccessToken { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime RefreshTokenExpirationDate { get; set; }
        public bool IsAccessTokenValid { get; set; } = false;
        [InverseProperty(nameof(Friend.User))]
        public virtual List<Friend> Friends { get; set; } = new List<Friend>();
    }
}
