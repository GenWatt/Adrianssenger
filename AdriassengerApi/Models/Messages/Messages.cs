using AdriassengerApi.Models.UserModels;
using Microsoft.Build.Framework;

namespace AdriassengerApi.Models.Messages
{
    public class Messages
    {
        public int Id { get; set; }
        [Required]
        public string Message { get; set; }
        public int SenderId { get; set; }
        [Required]
        public virtual User Sender { get; set; }
        public int ReceiverId { get; set; }
        [Required]
        public virtual User Receiver { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public bool Seen { get; set; } = false;
        public string? FilePath { get; set; }
    }
}
