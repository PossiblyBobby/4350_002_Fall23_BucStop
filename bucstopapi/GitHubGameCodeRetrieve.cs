using Octokit;
using System;
using System.Text;
using System.Threading.Tasks;

namespace bucstopapi
{
    public class GitHubGameCodeRetrieve
    {
        private readonly GitHubClient _client;

        public GitHubGameCodeRetrieve(string personalAccessToken)
        {
            _client = new GitHubClient(new ProductHeaderValue("BucStop"))
            {
                Credentials = new Credentials(personalAccessToken)
            };
        }

        /// <summary>
        /// Reaches out to the repo and gets the GameCode.js file, returning as a string.
        /// </summary>
        /// <param name="repoOwner">Username of the owner of games repo.</param>
        /// <param name="repoName">Repo holding the collection of games.</param>
        /// <param name="gameFilePath">Sent when the game ends</param>
        /// <param name="gameCodePath">The specific file name of the game code file.</param>
        /// <returns>Game code file as a string.</returns>
        public async Task<string> RetrieveGameCode(string repoOwner, string repoName, string gameFilePath, string gameCodePath)
        {
            string filePath = Path.Combine(gameFilePath, gameCodePath);

            // Fetch the GameCode.js file
            var fileContent = await _client.Repository.Content.GetAllContents(repoOwner, repoName, filePath);
            var existingContent = fileContent[0].Content;

            // Return game code file as string
            return existingContent;
        }
    }
}
