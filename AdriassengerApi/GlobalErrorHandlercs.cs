using AdriassengerApi.Exceptions;
using AdriassengerApi.Exceptions.ErrorService;

namespace AdriassengerApi
{
    public class GlobalErrorHandler
    {
        private readonly RequestDelegate _next;
        private readonly IErrorService _errorService;
        public GlobalErrorHandler(RequestDelegate next, IErrorService errorService)
        {
            _next = next;
            _errorService = errorService;
        }
        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }
        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = 500;
            return context.Response.WriteAsJsonAsync(_errorService.AddError(new IntervalError()).GetErrorResponse());
        }
    }
}
