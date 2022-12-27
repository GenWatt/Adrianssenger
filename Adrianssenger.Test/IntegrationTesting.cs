using AdriassengerApi.Models.Responses;
using AdriassengerApi.Models.UserModels;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace Adrianssenger.Test
{
    internal class IntegrationTesting : IClassFixture<TestingWebAppFactory<Program>>
    {
        public readonly HttpClient Client;

        public IntegrationTesting(TestingWebAppFactory<Program> factory)
        {
            Client = factory.CreateClient();
        }

        public async Task<SuccessResponse<User>?> Authenticate()
        {
            var formData = new MultipartFormDataContent()
            {
                { new StringContent("adrian@op.pl"), "Email" },
                { new StringContent("adrian"), "Password" },
                { new StringContent("Adrian"), "UserName" },
                { new StringContent(""), "ProfilePicture" },
            };

            await Client.PostAsync("/api/Account/Register", formData);

            var loginResponse = await Client.PostAsJsonAsync("/api/Account/Login", new LoginRequest
                { 
                    Password = "adrian", 
                    UserName = "Adrian" 
                });

            var loginResponseDeserialized = await loginResponse.Content.ReadFromJsonAsync<SuccessResponse<User>>();

            if (loginResponseDeserialized is not null && loginResponseDeserialized.Data is not null) 
                Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", loginResponseDeserialized.Data.AccessToken);
           
            return loginResponseDeserialized;
        }
    }
}
