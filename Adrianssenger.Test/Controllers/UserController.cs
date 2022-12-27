using AdriassengerApi.Models.Responses;
using AdriassengerApi.Models.UserModels;
using System.Net.Http.Json;

namespace Adrianssenger.Test.Controllers
{
    public class UserController
    {

        private readonly IntegrationTesting _app;

        public UserController()
        {
            _app = new IntegrationTesting(new TestingWebAppFactory<Program>());
        }

        [Fact]
        public async void GetSearchUsers_ShouldReturn_()
        {
            await _app.Authenticate();
            var substring = "a";

            var response = await _app.Client.GetAsync($"/api/Users/Search?searchText={substring}");
            var parsedRespones = await response.Content.ReadFromJsonAsync<SuccessResponse<IEnumerable<SearchUser>>>();

            Assert.NotNull(parsedRespones);
            if (parsedRespones is not null && parsedRespones.Data is not null)
            {
                foreach (var user in parsedRespones.Data.ToList())
                {
                    Assert.Contains(substring.ToLower(), user.UserName.ToLower());
                }
            }
        }
    }
}
