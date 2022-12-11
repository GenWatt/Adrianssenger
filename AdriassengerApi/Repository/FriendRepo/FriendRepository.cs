using AdriassengerApi.Data;
using AdriassengerApi.Models.Friends;

namespace AdriassengerApi.Repository.FriendRepo
{
    public class FriendRepository : Repository<Friend>, IFriendRepository
    {
        private readonly ApplicationContext _context;
        public FriendRepository(ApplicationContext context) : base(context)
        {
            _context = context;
        }

    }
}
