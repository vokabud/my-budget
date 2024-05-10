using MyBudget.Core.Models.Rules;
using MyBudget.Core.Models.Mmc;
using MyBudget.Core.Tools;

Console.WriteLine("Start");

var mmcJson = "G:\\Solutions\\my-budget\\MCC.json";
var rulesJson = "G:\\Solutions\\my-budget\\rules.json";

var name = "04";
var reportCsv = $"G:\\Solutions\\my-budget\\{name}.csv";

var jsonReader = new JsonReader();
var jsonWriter = new JsonWriter();
var bankReportReader = new BankReportReader();

var mmc = jsonReader.Read<SubGroup[]>(mmcJson);
var rules = jsonReader.Read<Rules>(rulesJson);

var bankReport = bankReportReader
    .ImportFromCsv(reportCsv);

var report = new ReportGenerator(rules)
    .Generate(mmc, bankReport);

jsonWriter.Write(report, $"G:\\Solutions\\my-budget\\{name}.json");

Console.WriteLine("Finish");
