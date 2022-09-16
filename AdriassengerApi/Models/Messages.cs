using Microsoft.Build.Framework;

namespace AdriassengerApi.Models
{
    public class Messages
    {
        public int Id { get; set; }
        [Required]
        public string Message { get; set; }
        [Required]
        public int Sender { get; set; }
        [Required]
        public int Receiver { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool Seen { get; set; }
        public string FilePath { get; set; }

    }
}
