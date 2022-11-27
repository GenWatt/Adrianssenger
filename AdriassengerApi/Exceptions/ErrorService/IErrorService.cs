using AdriassengerApi.Utils.Response;

namespace AdriassengerApi.Exceptions.ErrorService
{
    public interface IErrorService
    {
        ErrorService AddError(Error error);
        List<Error> GetErrors();
        ErrorReponse<List<Error>> GetErrorResponse();
    }
}