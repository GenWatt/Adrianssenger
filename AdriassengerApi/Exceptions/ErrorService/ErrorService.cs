using AdriassengerApi.Utils.Response;

namespace AdriassengerApi.Exceptions.ErrorService
{
    public class Error
    {
        public string Type;
        public string ErrorMessage;
    }
    public class ErrorService : IErrorService
    {
        private List<Error> Errors { get; set; } = new List<Error>();

        public ErrorService AddError(Error error)
        {
            Errors.Add(error);
            return this;
        }
        public List<Error> GetErrors()
        {
            return Errors;
        }

        public ErrorReponse<List<Error>> GetErrorResponse()
        {
            return new ErrorReponse<List<Error>> { Errors = GetErrors() };
        }
    }
}
