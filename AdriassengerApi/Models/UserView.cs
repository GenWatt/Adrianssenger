using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace AdriassengerApi.Models
{
    public class UserView
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Username is required")]
        [MinLength(3, ErrorMessage = "Username should have more than 3 characters!")]
        public string Username { get; set; }
        [Required(ErrorMessage = "E-mail is required")]
        [EmailAddress]
        public string Email { get; set; }
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
        public string? RefreshToken { get; set; } = null;
        public DateTime? RefreshExpiration { get; set; } = null;
        public bool isVerifed { get; set; } = false;
    }
}
