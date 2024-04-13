using BucStop;
using BucStop.Helpers;
using BucStop.Models;
using BucStop.Services;
// test comment GitHub is a PITA
/*
 * This is the base program which starts the project.
 */

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

var provider=builder.Services.BuildServiceProvider();
var configuration=provider.GetRequiredService<IConfiguration>();

builder.Services.AddHttpClient("API", client =>
{
    client.BaseAddress = new Uri("http://localhost:5219");
});

builder.Services.AddAuthentication("CustomAuthenticationScheme").AddCookie("CustomAuthenticationScheme", options =>
{
    options.LoginPath = "/Account/Login";
});

builder.Services.AddSingleton<GameService>();

builder.Services.AddTransient<GameInfoHelper>(serviceProvider => {
    var logger = serviceProvider.GetRequiredService<ILogger<GameInfoHelper>>();
    var httpClient = serviceProvider.GetRequiredService<IHttpClientFactory>().CreateClient();
    string apiBaseUrl = builder.Configuration["ApiBaseUrl"];  // Ensure this key is in appsettings.json
    return new GameInfoHelper(httpClient, apiBaseUrl, logger);
});

builder.Services.AddScoped<List<Game>>(serviceProvider => {
    // Assuming GameService fetches games
    var gameService = serviceProvider.GetRequiredService<GameService>();
    return gameService.GetGames();
});

builder.Services.AddScoped<PlayCountManager>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

//Handles routing to "separate" game pages by setting the Play page to have subpages depending on ID
app.MapControllerRoute(
    name: "Games",
    pattern: "Games/{action}/{id?}",
    defaults: new { controller = "Games", action = "Index" });

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
