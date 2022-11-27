namespace AdriassengerApi.Models
{
    public class Connection
    {
        public int Id { get; set; }
        public string ConnectionId { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }
    }
}
