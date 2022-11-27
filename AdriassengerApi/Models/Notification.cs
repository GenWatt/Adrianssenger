
namespace AdriassengerApi.Models
{
    public enum NotificationActionType { FRIEND }
    public enum NotificationActions { READ, ACCEPTORNOT }
    public enum NotificationType { SUCCESS, ERROR, WARNING, INFO }

    public class FriendNotificationUrl
    {
        static public string Accept { get; } = "/Friends/Accept";
        static public string Reject { get; } = "/Friends/Reject";
    }
    public class Notification
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public bool Seen { get; set; }
        public NotificationActions Action { get; set; } = NotificationActions.READ;
        public NotificationType Type { get; set; } = NotificationType.INFO;
        public NotificationActionType? ActionType { get; set; }
        public string AcceptUrl { get; set; } = string.Empty;
        public string RejectUrl { get; set; } = string.Empty;
        public int ActionId { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }
    }
}
