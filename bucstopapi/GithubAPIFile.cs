using System.Net.Http.Headers;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using BucStop_API.Models;

namespace bucstopapi
{
    public class GithubAPIFile
    {
        public class GitHubApiClient
        {
            private readonly HttpClient _httpClient;
            public GitHubApiClient(string personalAccessToken)
            {
                _httpClient = new HttpClient();
                // Setup HttpClient instance to use the GitHub API
                _httpClient.BaseAddress = new Uri("https://api.github.com/");
                // GitHub API requires a user-agent
                _httpClient.DefaultRequestHeaders.UserAgent.Add(
                    new ProductInfoHeaderValue("AppName", "1.0")
                );
                // Use the personal access token for authentication
                _httpClient.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", personalAccessToken);
            }

            public async Task<string> GetRepositoryContentsAsync(string repoOwner, string repoName, string path = "")
            {
                // Construct the request URL
                string requestUrl = $"repos/{repoOwner}/{repoName}/contents/{path}";
                // Make the request
                HttpResponseMessage response = await _httpClient.GetAsync(requestUrl);
                if (response.IsSuccessStatusCode)
                {
                    // Read the response as a string
                    string content = await response.Content.ReadAsStringAsync();
                    return content;
                }
                else
                {
                    throw new Exception($"Failed to fetch repository contents: {response.ReasonPhrase}");
                }
            }
        }

        public static string DecodeContentFromBase64(string base64Content)
        {
            byte[] data = Convert.FromBase64String(base64Content);
            return System.Text.Encoding.UTF8.GetString(data);
        }
    }
}
