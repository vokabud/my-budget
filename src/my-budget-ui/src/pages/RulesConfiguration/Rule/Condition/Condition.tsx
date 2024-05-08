import { FC } from 'react';
import {
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';

import {
  IRule,
  Property,
  RuleCondition,
} from 'types';

interface IProps {
  rule: IRule;
  onChange: (rule: IRule) => void;
}

const Condition: FC<IProps> = ({ rule, onChange }) => {
  const handlePropertyChange = (event: SelectChangeEvent) => {
    const property = event.target.value as Property;

    if (property && rule) {
      onChange({ ...rule, property: property });
    }
  };

  const handleConditionChange = (event: SelectChangeEvent) => {
    const condition = event.target.value;

    if (condition && rule) {
      onChange({
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
      onChange({ ...rule, value: value });
    }
  }

  if (rule === null) {
    return null;
  }

  return (
    <>
      <Select
        style={{ width: '15%', marginLeft: '10px' }}
        variant={'standard'}
        value={rule.property}
        onChange={handlePropertyChange}
      >
        <MenuItem value={Property.Currency}>Currency</MenuItem>
        <MenuItem value={Property.Details}>Details</MenuItem>
        <MenuItem value={Property.MCC}>MCC</MenuItem>
      </Select>

      <Select
        style={{ width: '15%', marginLeft: '10px' }}
        variant={'standard'}
        value={RuleCondition[rule.condition]}
        onChange={handleConditionChange}
      >
        <MenuItem value={RuleCondition[RuleCondition.Contains]}>contains</MenuItem>
        <MenuItem value={RuleCondition[RuleCondition.Equals]}>equals to</MenuItem>
      </Select>

      <TextField
        style={{ width: '15%', marginLeft: '10px' }}
        value={rule.value}
        variant={'standard'}
        onChange={handleValueChange}
      />
    </>
  );
};

export default Condition;
