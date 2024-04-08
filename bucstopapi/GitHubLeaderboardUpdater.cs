using Octokit;
using System;
using System.Text;
using System.Threading.Tasks;

namespace bucstopapi
{
    public class GitHubLeaderboardUpdater
    {
        private readonly GitHubClient _client;

        public GitHubLeaderboardUpdater(string personalAccessToken)
        {
            _client = new GitHubClient(new ProductHeaderValue("BucStop"))
            {
                Credentials = new Credentials(personalAccessToken)
            };
        }

        /// <summary>
        /// Retrieves the requested file from the requested repo, append new score to it, and then push back the appended file.
        /// </summary>
        /// <param name="repoOwner">Owner of the GitHub repo where file is stored.</param>
        /// <param name="repoName">The name of the GitHub repo.</param>
        /// <param name="filePath">The path to the file being appended to.</param>
        /// <param name="initials">The initials entered by the player of the game.</param>
        /// <param name="score">The final score of the game in question.</param>
        /// <returns></returns>
        public async Task UpdateGitHubLeaderboardAsync(string repoOwner, string repoName, string filePath, string initials, int score)
        {
            // Fetch the existing leaderboard file
            var fileContent = await _client.Repository.Content.GetAllContents(repoOwner, repoName, filePath);
            var existingContent = fileContent[0].Content;

            // Append the new score line
            var newScoreLine = $"{initials}: {score}";
            var updatedContent = $"{existingContent}\n{newScoreLine}";

            // Create update file request
            var updateRequest = new UpdateFileRequest("Update leaderboard", updatedContent, fileContent[0].Sha)
            {
                // Abstract this out for any committer
                Committer = new Committer("Chris B", "boylec1@etsu.edu", DateTimeOffset.Now)
            };

            // Push the updated file back to the GitHub repository
            await _client.Repository.Content.UpdateFile(repoOwner, repoName, filePath, updateRequest);
        }
    }
}
