using System.ComponentModel.DataAnnotations;

namespace AdriassengerApi.Models
{
    public class User
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
        public string RefreshToken { get; set; }
        public DateTime RefreshExpiration { get; set; }
        public bool isVerifed { get; set; } = false;
    }
}
