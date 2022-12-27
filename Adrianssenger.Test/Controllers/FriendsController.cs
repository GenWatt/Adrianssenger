using AdriassengerApi.Models.Friends;
using AdriassengerApi.Models.Responses;
using System.Net.Http.Json;

namespace Adrianssenger.Test.Controllers
{
    public class FriendsControllerTest
    {
        private readonly IntegrationTesting _app;

        public FriendsControllerTest()
        {
            _app = new IntegrationTesting(new TestingWebAppFactory<Program>());
        }

        [Fact]
        public async void GetFriend_ShouldReturn_EmptyArray()
        {
            await _app.Authenticate();

            var response = await _app.Client.GetAsync("/api/Friends");

            var friends = await response.Content.ReadFromJsonAsync<SuccessResponse<IEnumerable<FriendResponse>>>();

            Assert.Empty(friends?.Data);
        }
    }
}