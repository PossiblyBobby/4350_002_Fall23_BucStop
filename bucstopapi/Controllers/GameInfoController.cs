using Microsoft.AspNetCore.Mvc;
using BucStop_API.Models;

namespace BucStop_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GameInfoController : ControllerBase
    {
        [HttpGet("{gameName}")]
        public ActionResult<GameDetails> GetGameDetails(string gameName)
        {
            var gameDetails = new GameDetails
            {
                GameName = gameName,
                GameDescription = "Placeholder Description",
                HowToPlay = "Placeholder Instructions",
                GameThumbnail = "Placeholder Thumbnail URL or base64",
                GameJavaScript = "Placeholder JavaScript Code",
                LeaderboardInfo = "Placeholder Leaderboard Data"
            };

            return Ok(gameDetails);
        }
    }
}
