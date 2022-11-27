﻿namespace AdriassengerApi.Utils.Response
{
    public class SuccessResponse<T>
    {
        public bool Success { get; } = true;
        public string Message { get; set; } = "Success";
        public T? Data { get; set; } = default(T);
    }
}
