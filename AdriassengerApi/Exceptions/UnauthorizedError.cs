using AdriassengerApi.Exceptions.ErrorService;

namespace AdriassengerApi.Exceptions
{
    public class UnauthorizedError : Error
    {
        public readonly string ErrorMessage = "You are unauthorized";
        public readonly string Type = "Auth";
    }
}
