using AdriassengerApi.Models;
using AdriassengerApi.Utils;
using Microsoft.AspNetCore.Mvc;

namespace AdriassengerApi.Controllers
{
    public interface IFriendsController
    {
        Task<IActionResult> DeleteFriend(int id);
        Task<ActionResult<IEnumerable<FriendResponse>>> GetFriend(int id);
        Task<ActionResult<IEnumerable<Friend>>> Getfriends();
        Task<ActionResult<Friend>> PostFriend(int id, FriendView friend);
        Task<IActionResult> PutFriend(int id, Friend friend);
    }
}