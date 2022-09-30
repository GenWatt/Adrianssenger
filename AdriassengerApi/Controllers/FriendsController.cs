using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AdriassengerApi.Data;
using AdriassengerApi.Models;
using AdriassengerApi.Utils;
using Microsoft.AspNetCore.Authorization;

namespace AdriassengerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendsController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public FriendsController(ApplicationContext context)
        {
            _context = context;
        }

        // GET: api/Friends
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Friend>>> Getfriends()
        {
            return await _context.friends.Include(u => u.User).ToListAsync();
        }

        // GET: api/Friends/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<FriendResponse>>> GetFriend(int id)
        {
            var friendContext = _context.friends;
            var friends1 = await friendContext
                .Where(f => f.UserId == id)
                .Include(f => f.SecondUser)
                .Select(f => new FriendResponse() { FriendId = f.FriendId, Id = f.SecondUser.Id, Username = f.SecondUser.Username, CreatedDate = f.CreatedDate, LastMessage = f.LastMessage })
                .ToListAsync();
            var friends2 = await friendContext
                .Where(f => f.SecondUserId == id)
                .Include(f => f.User)
                .Select(f => new FriendResponse() { FriendId = f.FriendId, Id = f.User.Id, Username = f.User.Username, CreatedDate = f.CreatedDate, LastMessage = f.LastMessage })
                .ToListAsync();

            if (friends1.Count == 0 && friends2.Count == 0)
            {
                return NotFound();
            }
            var friends = friends1.Concat(friends2);

            return Ok(new Response<IEnumerable<FriendResponse>>(true, "Successfully fetched friends", friends));
        }

        // PUT: api/Friends/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFriend(int id, Friend friend)
        {
            if (id != friend.FriendId)
            {
                return BadRequest();
            }

            _context.Entry(friend).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FriendExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Friends
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("{id}")]
        [Authorize]
        public async Task<ActionResult<Friend>> PostFriend(int id, FriendView friend)
        {
            var newFriend = new Friend();

            newFriend.UserId = id;
            newFriend.SecondUserId = friend.SecondUserId;
            
            _context.friends.Add(newFriend);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFriend", new { id = friend.FriendId }, friend);
        }

        // DELETE: api/Friends/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFriend(int id)
        {
            var friend = await _context.friends.FindAsync(id);
            if (friend == null)
            {
                return NotFound();
            }

            _context.friends.Remove(friend);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FriendExists(int id)
        {
            return _context.friends.Any(e => e.FriendId == id);
        }
    }
}
