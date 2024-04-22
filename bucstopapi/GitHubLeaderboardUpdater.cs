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
        /// Updates the leaderboard file in the game of choice with the recently-ended game score.
        /// </summary>
        /// <param name="repoOwner">Username of the owner of games repo.</param>
        /// <param name="repoName">Repo holding the collection of games.</param>
        /// <param name="gameFilePath">Sent when the game ends</param>
        /// <param name="initials">Initials entered by the player of the recently-ended game.</param>
        /// <param name="score">Score of the recently-ended game.</param>
        /// <returns></returns>
        public async Task UpdateGitHubLeaderboardAsync(string repoOwner, string repoName, string gameFilePath, string initials, int score)
        {
            string filePath = Path.Combine(gameFilePath, "Leaderboard.txt");
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
