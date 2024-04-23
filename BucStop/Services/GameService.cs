using System.Collections.Generic;
using System.IO;
using BucStop.Models;
using System.Text.Json;

public class GameService
{
    private string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "games.json");

    // Reads JSON data from a file, deserializes it into a List of Game objects, and returns the result
    public List<Game>? GetGames()
    {
        string json = File.ReadAllText(path);
        List<Game>? games = JsonSerializer.Deserialize<List<Game>>(json);
        return games;
    }
}