using AdriassengerApi.Models;
namespace AdriassengerApi.Repository.UserRepo
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByUsername(string username);
        Task SaveAsync();
    }
}