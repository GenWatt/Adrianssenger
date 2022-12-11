using System.ComponentModel.DataAnnotations.Schema;
using AdriassengerApi.Models.UserModels;

namespace AdriassengerApi.Models.Friends
{
    public class Friend
    {
        public int FriendId { set; get; }
        public int UserId { set; get; }
        [ForeignKey(nameof(UserId))]
        [InverseProperty("Friends")]
        public virtual User User { get; set; }
        public int SecondUserId { set; get; }
        public virtual User SecondUser { get; set; }
        public string LastMessage { set; get; } = string.Empty;
        public bool RequestAccepted { set; get; } = false;
        public bool Deleted { set; get; } = false;
        public DateTime CreatedDate { set; get; } = DateTime.Now;
    }
}
