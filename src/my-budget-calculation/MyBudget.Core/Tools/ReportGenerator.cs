using MyBudget.Core.Models.Mmc;
using MyBudget.Core.Models.Report;
using MyBudget.Core.Models.Rules;

using Transaction = MyBudget.Core.Models.Transactions.Transaction;
using ExpenseDetails = MyBudget.Core.Models.Transactions.Expense;

namespace MyBudget.Core.Tools;

public class ReportGenerator
{
    private readonly Rules _rules;

    public ReportGenerator(
        Rules rules)
    {
        _rules = rules;
    }

    public ExpenseReport Generate(SubGroup[] mmc, List<Transaction> transactions)
    {
        var expenses = GetExpenseDetails(mmc, transactions)
            .Where(_ => _.TransactionAmount < 0);

        var result = new ExpenseReport
        {
            EndDate = DateOnly.FromDateTime(transactions.Max(_ => _.Date)),
            StartDate = DateOnly.FromDateTime(transactions.Min(_ => _.Date)),
            Total = expenses
                .Where(_ => _.TransactionAmount < 0)
                .Sum(_ => _.TransactionAmount)
        };

        var categories = expenses
            .GroupBy(_ => new { _.Category })
            .OrderBy(_ => _.Key.Category)
            .ToList();

        foreach (var categoryGrouped in categories)
        {
            var category = new Category
            {
                Name = categoryGrouped.Key.Category,
                Total = categoryGrouped.Sum(_ => _.TransactionAmount),
                SubCategories = new List<SubCategory>()
            };

            var subCategories = categoryGrouped
                .GroupBy(_ => new { _.SubCategory })
                .OrderBy(_ => _.Key.SubCategory)
                .ToList();

            foreach (var subCategory in subCategories)
            {
                category
                    .SubCategories
                    .Add(new SubCategory
                    {
                        Name = subCategory.Key.SubCategory,
                        Total = subCategory.Sum(_ => _.TransactionAmount),
                        Expenses = subCategory
                        .Select(_ => new Expense
                        {
                            Date = _.Date,
                            TransactionAmount = _.TransactionAmount,
                            Details = _.Details
                        })
                        .OrderBy(_ => _.Date)
                        .ToList()
                    });
            }

            result
                .Categories
                .Add(category);
        }

        return result;
    }

    private List<ExpenseDetails> GetExpenseDetails(
        SubGroup[] mmc,
        List<Transaction> transactions)
    {
        var result = new List<ExpenseDetails>();
        var grouppedMmc = mmc.ToDictionary(_ => _.Mcc);

        foreach (var transaction in transactions)
        {
            if (grouppedMmc.TryGetValue(transaction.MCC, out var subGroup))
            {
                result.Add(new ExpenseDetails
                {
                    Details = transaction.Details,
                    Category = RuleProcessor.Process(_rules.Categories, transaction, subGroup.Group.Description),
                    SubCategory = RuleProcessor.Process(_rules.SubCategories, transaction, subGroup.FullDescription.Replace(',', ' ')),
                    Date = transaction.Date,
                    MCC = transaction.MCC,
                    TransactionAmount =  transaction.TransactionAmount * GetExchangeRate(transaction.ExchangeRate),
                });
            }
        }

        return result;
    }

    private static decimal GetExchangeRate(string exchangeRate)
    {
        if (decimal.TryParse(exchangeRate, out var result))
        {
            return result;
        }

        return 1;
    }
}
