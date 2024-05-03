namespace MyBudget.Core.Models.Rules;

public class Rule
{
    public string Property { get; set; }

    public Condition Condition { get; set; }

    public string Value { get; set; }

    public Result Result { get; set; }
}
