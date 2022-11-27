using AdriassengerApi.Models;
using System.ComponentModel.DataAnnotations;
namespace AdriassengerApi.Utils
{
    public class UserData
    {
        public string Username { get; set; }
        public string Password { get; set; }

    }

    public class FriendResponse
    {

        public FriendResponse(Friend friend, User user)
        {
            Id = user.Id;
            FriendId = friend.FriendId;
            UserName = user.UserName;
            LastMessage = friend.LastMessage;
            CreatedDate = friend.CreatedDate;
        }
        public int Id { get; set; }
        public int FriendId { get; set; }
        public string UserName { get; set; }
        public string LastMessage { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class TokenApiModel
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }

    public class Response<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }

        public Response(bool success, string message, T? data)
        {
            Success = success;
            Message = message;
            Data = data;
        }
    }

    class ValidationErrorResponse
    {
        public bool Success { get; set; } = false;
        public string Message { get; set; }
        public Object? ValidationData { get; set; }

        public ValidationErrorResponse(string message, Object? validationData)
        {
            Message = message;
            ValidationData = validationData;
        }

        public ValidationErrorResponse(string message)
        {
            Message = message;
        }
    }

    public class UserWithToken
    {
        public string Username { get; set; }
        public int Id { get; set; }
        public string Token { get; set; }
        public string RefreshToken { set; get; }

        public UserWithToken(string username, int id, string token, string refreshToken)
        {
            Username = username;
            Id = id;
            Token = token;
            RefreshToken = refreshToken;
        }
    }

}
