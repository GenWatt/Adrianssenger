namespace AdriassengerApi.Utils.Response
{
    public class ErrorReponse<T>
    {
        public bool Success { get; } = false;
        public T? Errors { get; set; } = default(T);
    }

    public class ApiErrorType
    {
        public static string Interval { get; } = "Interval";
        public static string Auth { get; } = "Auth";
        public static string BadRequest { get; } = "BadRequest";
    }

    public class ApiError
    {
        public string Type { get; set; } = ApiErrorType.Interval;
        public string ErrorMessage { get; set; } = String.Empty;

    }

    public class ErrorHandler
    {
        List<ApiError> errors = new List<ApiError>();

        public void AddError(ApiError error)
        {
            errors.Add(error);
        }

        public List<ApiError> GetErrors()
        {
            return errors;
        }
    }
}
