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

        public async Task<string> RetrieveGameCode(string repoOwner, string repoName, string gameFilePath, string gameCodePath)
        {
            string filePath = Path.Combine(gameFilePath, gameCodePath);
            // Fetch the existing leaderboard file
            var fileContent = await _client.Repository.Content.GetAllContents(repoOwner, repoName, filePath);
            var existingContent = fileContent[0].Content;

            // Append the new score line
            //var newScoreLine = $"{initials}: {score}";
            //var updatedContent = $"{existingContent}\n{newScoreLine}";

            // Create update file request
            //var updateRequest = new UpdateFileRequest("Update leaderboard", updatedContent, fileContent[0].Sha)
            //{
            //    // Abstract this out for any committer
            //    Committer = new Committer("Chris B", "boylec1@etsu.edu", DateTimeOffset.Now)
            //};

            // Push the updated file back to the GitHub repository
            //await _client.Repository.Content.UpdateFile(repoOwner, repoName, filePath, updateRequest);
            return existingContent;
        }
    }
}
