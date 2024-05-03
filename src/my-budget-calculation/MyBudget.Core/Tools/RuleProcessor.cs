using System.Linq.Expressions;
using MyBudget.Core.Models.Rules;
using MyBudget.Core.Models.Transactions;

namespace MyBudget.Core.Tools;

public class RuleProcessor
{
    public static string Process(Rule[] rules, Transaction transaction, string defaultValue)
    {
        foreach (var rule in rules)
        {
            var condition = BuildCondition<Transaction>(rule);

            if (condition(transaction))
            {
                if (rule.Result.Type == ResultType.FromValue)
                {
                    return rule.Result.Value;
                }

                if (rule.Result.Type == ResultType.FromProperty)
                {
                    var fromProperty = GetFromProperty<Transaction>(rule);
                    return fromProperty(transaction);
                }
            }
        }

        return defaultValue;
    }

    private static Func<T, bool> BuildCondition<T>(Rule rule)
    {
        var parameter = Expression.Parameter(typeof(T));

        var property = Expression.Property(parameter, rule.Property);
        var constant = Expression.Constant(rule.Value);

        Expression body = rule.Condition switch
        {
            Condition.Equals => Expression
                .Equal(property, constant),
            Condition.Contains => Expression
                .Call(property, typeof(string)
                .GetMethod("Contains", new[] { typeof(string) }), constant),
            _ => throw new NotImplementedException(),
        };

        return Expression.Lambda<Func<T, bool>>(body, parameter).Compile();
    }

    private static Func<T, string> GetFromProperty<T>(Rule rule)
    {
        var parameter = Expression.Parameter(typeof(T), nameof(T).ToLower());
        var property = Expression.Property(parameter, rule.Result.Property);

        return Expression.Lambda<Func<T, string>>(property, parameter).Compile();
    }
}