using MyBudget.Core.Models.Rules;
using MyBudget.Core.Models.Mmc;
using MyBudget.Core.Tools;

Console.WriteLine("Start");

var mmcJson = "G:\\Solutions\\my-budget\\MCC.json";
var categoryRulesJson = "G:\\Solutions\\my-budget\\categoryRules.json";
var subCategoryRulesJson = "G:\\Solutions\\my-budget\\subCategoryRules.json";

var name = "04";
var reportCsv = $"G:\\Solutions\\my-budget\\{name}.csv";

var jsonReader = new JsonReader();
var jsonWriter = new JsonWriter();
var bankReportReader = new BankReportReader();

var mmc = jsonReader.Read<SubGroup[]>(mmcJson);
var categoryRules = jsonReader.Read<Rule[]>(categoryRulesJson);
var subCategoryRules = jsonReader.Read<Rule[]>(subCategoryRulesJson);

var bankReport = bankReportReader
    .ImportFromCsv(reportCsv);

var report = new ReportGenerator(categoryRules, subCategoryRules)
    .Generate(mmc, bankReport);

jsonWriter.Write(report, $"G:\\Solutions\\my-budget\\{name}.json");

Console.WriteLine("Finish");
