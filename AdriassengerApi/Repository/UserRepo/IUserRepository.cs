using AdriassengerApi.Models.UserModels;

namespace AdriassengerApi.Repository.UserRepo
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByUsername(string username);
    }
}