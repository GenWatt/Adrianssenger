using Microsoft.Build.Framework;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdriassengerApi.Models
{
    public class Messages
    {
        public int Id { get; set; }
        [Required]
        public string Message { get; set; }
        [Required]
        public virtual User Sender { get; set; }
        [Required]
        public virtual User Receiver { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool Seen { get; set; }
        public string FilePath { get; set; }
    }
}
