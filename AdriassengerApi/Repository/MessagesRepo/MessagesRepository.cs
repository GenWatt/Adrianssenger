using AdriassengerApi.Data;
using AdriassengerApi.Models.Messages;

namespace AdriassengerApi.Repository.MessagesRepo
{
    public class MessagesRepository : Repository<Messages>, IMessagesRepository
    {
        public MessagesRepository(ApplicationContext context) : base(context)
        {

        }
    }
}
