using System.ComponentModel.DataAnnotations;

namespace AdriassengerApi.Models.UserModels
{
    public class UserRequest
    {
        [Required(ErrorMessage = "Username is required")]
        [MinLength(3, ErrorMessage = "Username should have more than 3 characters!")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "E-mail is required")]
        [EmailAddress]
        public string Email { get; set; }
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }

        public IFormFile? ProfilePicture { get; set; }
    }

    public class UserViewWithId : UserRequest
    {
        public int Id { get; set; }
    }
}
