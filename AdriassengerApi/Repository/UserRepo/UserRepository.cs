using AdriassengerApi.Data;
using AdriassengerApi.Models.UserModels;
using AdriassengerApi.Repository.UserRepo;
using Microsoft.EntityFrameworkCore;

namespace AdriassengerApi.Repository.UserRepo
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        private readonly ApplicationContext _context;
        public UserRepository(ApplicationContext context) : base(context)
        {
            _context = context;
        }

        public async Task<User?> GetByUsername(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);
        }
    }
}
