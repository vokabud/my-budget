using MyBudget.Core.Models.Rules;
using MyBudget.Core.Models.Transactions;
using MyBudget.Core.Tools;

namespace MyBudget.Core.Tests
{
    public class UnitTest1
    {
        [Fact]
        public void Test1()
        {
            var transaction = new Transaction
            {
                Date = DateTime.Now,
                Details = "Details",
                MCC = "MCC",
                CardAmount = "CardAmount",
                TransactionAmount = 1,
                Currency = "Currency",
                ExchangeRate = "ExchangeRate",
                CommissionAmount = "CommissionAmount",
                CashbackAmount = "CashbackAmount",
                Balance = "Balance"
            };

            var rule = new Rule
            {
                Property = "Details",
                Condition = Condition.Equals,
                Value = "Details",
                Result = new Result
                {
                    Type = ResultType.FromValue,
                    Value = "My Value"
                }
            };

            var res = RuleProcessor.Test(rule, transaction, "default");

            Assert.True(res == rule.Result.Value);
        }

        [Fact]
        public void Test2()
        {
            var transaction = new Transaction
            {
                Date = DateTime.Now,
                Details = "Details",
                MCC = "MCC",
                CardAmount = "CardAmount",
                TransactionAmount = 1,
                Currency = "Currency",
                ExchangeRate = "ExchangeRate",
                CommissionAmount = "CommissionAmount",
                CashbackAmount = "CashbackAmount",
                Balance = "Balance"
            };

            var rule = new Rule
            {
                Property = "Details",
                Condition = Condition.Equals,
                Value = "Details",
                Result = new Result
                {
                    Type = ResultType.FromValue,
                    Value = "CashbackAmount"
                }
            };

            var res = RuleProcessor.Test(rule, transaction, "default");

            Assert.True(res == transaction.CashbackAmount);
        }
    }
}