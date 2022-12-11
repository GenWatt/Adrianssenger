using AdriassengerApi.Models.UserModels;

namespace AdriassengerApi.Models.Friends
{
    public class FriendResponse
    {
        public FriendResponse(Friend friend, User user)
        {
            Id = user.Id;
            FriendId = friend.FriendId;
            UserName = user.UserName;
            LastMessage = friend.LastMessage;
            CreatedDate = friend.CreatedDate;
            AvatarUrl = user.AvatarUrl;
        }

        public FriendResponse(Friend friend, User user, int unseenMesagesCount)
        {
            Id = user.Id;
            FriendId = friend.FriendId;
            UserName = user.UserName;
            LastMessage = friend.LastMessage;
            CreatedDate = friend.CreatedDate;
            AvatarUrl = user.AvatarUrl;
            UnseenMessagesCount = unseenMesagesCount;
        }
        public int Id { get; set; }
        public int FriendId { get; set; }
        public string UserName { get; set; }
        public string LastMessage { get; set; }
        public int UnseenMessagesCount { get; set; }

        public string AvatarUrl { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
