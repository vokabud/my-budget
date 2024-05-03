using MyBudget.Core.Models.Rules;
using MyBudget.Core.Models.Transactions;
using MyBudget.Core.Tools;

namespace MyBudget.Core.Tests
{
    public class PdfParserTests
    {
        [Fact]
        public void Test1()
        {

            var parser = new PDFParser();
            var result = parser.ExtractText("G:/Solutions/my-budget/report.pdf", "G:/Solutions/my-budget/report.html");

            Console.WriteLine(result);

            //new PdfParser().Parse("G:/Solutions/my-budget/report.pdf");
        }
    }
}