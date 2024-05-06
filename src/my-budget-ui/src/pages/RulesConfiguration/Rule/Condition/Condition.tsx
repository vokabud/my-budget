import { MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import {
  IRule,
  Property,
  RuleCondition,
} from 'types';

interface IProps {
  value: IRule;
}

const Condition: FC<IProps> = ({ value }) => {
  const [rule, setRule] = useState<IRule | null>(null);

  useEffect(() => {
    setRule(value);
  }, [value]);

  const handlePropertyChange = (event: SelectChangeEvent) => {
    const property = event.target.value as Property;

    if (property && rule) {
      setRule({ ...rule, property: property });
    }
  };

  const handleConditionChange = (event: SelectChangeEvent) => {
    const condition = event.target.value;

    if (condition && rule) {
      setRule({
        ...rule,
        condition: condition == RuleCondition[RuleCondition.Contains]
          ? RuleCondition.Contains
          : RuleCondition.Equals
      });
    }
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value && rule) {
      setRule({ ...rule, value: value });
    }
  }

  if (rule === null) {
    return null;
  }

  return (
    <>
      <Select
        variant={'standard'}
        value={rule.property}
        onChange={handlePropertyChange}
      >
        <MenuItem value={Property.Currency}>If Currency</MenuItem>
        <MenuItem value={Property.Details}>If Details</MenuItem>
        <MenuItem value={Property.MCC}>If MCC</MenuItem>
      </Select>

      <Select
        variant={'standard'}
        value={RuleCondition[rule.condition]}
        onChange={handleConditionChange}
      >
        <MenuItem value={RuleCondition[RuleCondition.Contains]}>contains</MenuItem>
        <MenuItem value={RuleCondition[RuleCondition.Equals]}>equals to</MenuItem>
      </Select>

      <TextField
        value={rule.value}
        variant={'standard'}
        onChange={handleValueChange}
      />
    </>
  );
};

export default Condition;
