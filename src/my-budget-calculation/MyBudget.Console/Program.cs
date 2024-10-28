using MyBudget.Core.Models.Rules;
using MyBudget.Core.Models.Mmc;
using MyBudget.Core.Tools;
using Spectre.Console;

var selectedDirectory = string.Empty;
var selectedFile = string.Empty;

string currentDirectory = Directory.GetCurrentDirectory();

while (true)
{
    var directories = Directory
        .GetDirectories(currentDirectory)
        .Select(_ => Path.GetFileName(_))
        .ToArray();

    // Add special options for navigation
    var folderOptions = new List<string>
    {
        "Select this",
        ".." // Go to parent directory
    };

    folderOptions.AddRange(directories); // List subdirectories

    // Display folder selection prompt
    var selectedOption = AnsiConsole.Prompt(
        new SelectionPrompt<string>()
            .Title($"Current folder: {currentDirectory}")
            .PageSize(10)
            .AddChoices(folderOptions));

    // Handle user selection
    if (selectedOption == "..")
    {
        // Navigate to parent folder if not at the root drive
        currentDirectory = Directory.GetParent(currentDirectory)?.FullName ?? currentDirectory;
    }
    else if (selectedOption == "Select this")
    {
        selectedDirectory = currentDirectory;
        AnsiConsole.MarkupLine($"[green]You selected:[/] {selectedDirectory}");
        break;
    }
    else
    {
        // Set selected folder as the new current folder
        currentDirectory = Path.Combine(currentDirectory, selectedOption);
    }
}

var files = Directory
    .GetFiles(selectedDirectory)
    .Select(_ => Path.GetFileName(_));

if (files.Count() == 0)
{
    AnsiConsole.MarkupLine("[yellow]No files found in the folder.[/]");
    return;
}

selectedFile = AnsiConsole.Prompt(
    new SelectionPrompt<string>()
        .Title("Select a file to view its name:")
        .PageSize(10)
        .AddChoices(files));

AnsiConsole.MarkupLine($"[green]You selected:[/] {selectedFile}");

var mmcJson = Path.Combine(selectedDirectory, "MCC.json");
var rulesJson = Path.Combine(selectedDirectory, "Rules.json");
var reportCsv = Path.Combine(selectedDirectory, selectedFile);

var jsonReader = new JsonReader();
var jsonWriter = new JsonWriter();
var bankReportReader = new BankReportReader();

var mmc = jsonReader.Read<SubGroup[]>(mmcJson);
var rules = jsonReader.Read<Rules>(rulesJson);

var bankReport = bankReportReader
    .ImportFromCsv(reportCsv);

var report = new ReportGenerator(rules)
    .Generate(mmc, bankReport);

var resultFileName = Path.GetFileNameWithoutExtension(selectedFile);
var resultFilePath = Path.Combine(selectedDirectory, $"{resultFileName}.json");

jsonWriter.Write(report, resultFilePath);

AnsiConsole.MarkupLine($"[green]Result is ready:[/] {resultFilePath}");
