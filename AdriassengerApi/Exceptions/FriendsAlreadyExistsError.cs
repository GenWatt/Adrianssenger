using AdriassengerApi.Exceptions.ErrorService;

namespace AdriassengerApi.Exceptions
{
    public class FriendsAlreadyExistsError : Error
    {
        public readonly string ErrorMessage = "You are already friends";
        public readonly string Type = "User";
    }
}
