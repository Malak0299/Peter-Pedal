// Serves the static frontend in wwwroot/. All logic lives in the browser (wwwroot/js).
var app = WebApplication.CreateBuilder(args).Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.Run();
