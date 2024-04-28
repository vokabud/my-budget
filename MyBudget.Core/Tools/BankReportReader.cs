using System.Globalization;
using MyBudget.Core.Models.Transactions;

namespace MyBudget.Core.Tools;

public class BankReportReader
{
    private const string DateTimeFormatPattern = "dd.MM.yyyy H:mm:ss";

    public List<Transaction> ImportFromCsv(string filePath)
    {
        List<Transaction> transactions = new List<Transaction>();

        using (StreamReader reader = new StreamReader(filePath))
        {
            string line;
            while ((line = reader.ReadLine()) != null)
            {
                var columns = line.Split(',');

                if (DateTime.TryParseExact(GetColumnValue(columns, 0), DateTimeFormatPattern, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime date))
                {
                    var details = GetColumnValue(columns, 1);
                    var mcc = GetColumnValue(columns,2 );
                    var cardAmount = GetColumnValue(columns, 3);
                    var transactionAmount = decimal.Parse(GetColumnValue(columns, 4));
                    var currency = GetColumnValue(columns, 5);
                    var exchangeRate = GetColumnValue(columns, 6);
                    var commissionAmount = GetColumnValue(columns, 7);
                    var cashbackAmount = GetColumnValue(columns, 8);
                    var balance = GetColumnValue(columns, 9);

                    Transaction transaction = new Transaction
                    {
                        Date = date,
                        Details = details,
                        MCC = mcc,
                        CardAmount = cardAmount,
                        TransactionAmount = transactionAmount,
                        Currency = currency,
                        ExchangeRate = exchangeRate,
                        CommissionAmount = commissionAmount,
                        CashbackAmount = cashbackAmount,
                        Balance = balance,
                    };

                    transactions.Add(transaction);
                }
            }
        }

        return transactions;
    }

    public string GetColumnValue(string[] columns, int index)
    {
        return columns.Length > index ? columns[index].Trim('\"') : string.Empty;
    }
}
