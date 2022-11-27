using AdriassengerApi.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace AdriassengerApi.Controllers
{
    public interface IAccountController
    {
        Task<IActionResult> Login(LoginView user);
        Task<IActionResult> Register(UserView model);
    }
}