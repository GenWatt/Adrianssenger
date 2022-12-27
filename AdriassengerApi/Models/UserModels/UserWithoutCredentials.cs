using AdriassengerApi.Models.Friends;

namespace AdriassengerApi.Models.UserModels
{
    public class UserWithoutCredentials
    {

        public UserWithoutCredentials(User user)
        {
            UserName = user.UserName;
            AvatarUrl = user.AvatarUrl;
            Id = user.Id;
            Friends = user.Friends;
            AccessToken = user.AccessToken;
        }

        public string UserName { get; set; }
        public string AvatarUrl { get; set; }
        public string AccessToken { get; set; }
        public int Id { get; set; }
        public virtual List<Friend> Friends { get; set; } = new List<Friend>();
    }
}
