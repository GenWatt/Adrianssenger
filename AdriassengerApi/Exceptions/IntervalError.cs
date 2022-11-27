using AdriassengerApi.Exceptions.ErrorService;

namespace AdriassengerApi.Exceptions
{
    public class IntervalError : Error
    {
        public readonly string ErrorMessage = "Interval server error";
        public readonly string Type = "Interval";
    }
}
