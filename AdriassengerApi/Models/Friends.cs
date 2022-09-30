using System.ComponentModel.DataAnnotations.Schema;

namespace AdriassengerApi.Models
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
        public string? LastMessage { set; get; }
        public DateTime CreatedDate { set; get; } = DateTime.Now;
    }
}
