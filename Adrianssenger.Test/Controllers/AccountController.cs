using AdriassengerApi.Models.Responses;
using System.Net.Http.Json;

namespace Adrianssenger.Test.Controllers
{
    public class AccountControllerTest
    {
        private readonly IntegrationTesting _app;

        public AccountControllerTest()
        {
            _app = new IntegrationTesting(new TestingWebAppFactory<Program>());
        }

        [Fact]
        public async void Register_Should_CreateUsersForTesting()
        {
            var user = new MultipartFormDataContent()
            {
                { new StringContent("adrian@op.pl"), "Email" },
                { new StringContent("adrian"), "Password" },
                { new StringContent("Adrian"), "UserName" },
                { new StringContent(""), "ProfilePicture" },
            };       
            var user2 = new MultipartFormDataContent()
            {
                { new StringContent("adi@op.pl"), "Email" },
                { new StringContent("adi1"), "Password" },
                { new StringContent("adi"), "UserName" },
                { new StringContent(""), "ProfilePicture" },
            };

            var responseUser = await _app.Client.PostAsync("/api/Account/Register", user);
            var responseUser2 = await _app.Client.PostAsync("/api/Account/Register", user2);

            responseUser.EnsureSuccessStatusCode();
            responseUser2.EnsureSuccessStatusCode();

            var userData = await responseUser.Content.ReadFromJsonAsync<SuccessResponse<string>>();
            var userData2 = await responseUser2.Content.ReadFromJsonAsync<SuccessResponse<string>>();

            foreach (var dataContent in user)
            {
                var name = dataContent.Headers.ContentDisposition?.Name;
                var value = dataContent.ReadAsStringAsync().Result;

                if (name == "UserName")
                {
                    Assert.Equal($"{value} registered", userData?.Data);
                }
            }

            foreach (var dataContent in user2)
            {
                var name = dataContent.Headers.ContentDisposition?.Name;
                var value = dataContent.ReadAsStringAsync().Result;

                if (name == "UserName")
                {
                    Assert.Equal($"{value} registered", userData2?.Data);
                }
            }
        }
    }
}
