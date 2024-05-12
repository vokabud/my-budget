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
  RuleResultType,
} from 'types';

interface IProps {
  rule: IRule;
  onChange: (rule: IRule) => void;
}

const Result: FC<IProps> = ({ rule, onChange }) => {
  const handlePropertyChange = (event: SelectChangeEvent) => {
    onChange({
      ...rule,
      result: { ...rule.result, property: event.target.value as Property }
    });
  };

  const hanleTypeChange = (event: SelectChangeEvent) => {
    const type: RuleResultType = event.target.value == RuleResultType[RuleResultType.FromValue]
      ? RuleResultType.FromValue
      : RuleResultType.FromProperty;

    const property: Property = Property.Details;
    const value: string = 'Category';

    onChange({ ...rule, result: { type: type, property: property, value: value } });
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...rule,
      result: { ...rule.result, value: event.target.value }
    });
  }

  if (rule === null) {
    return null;
  }

  return (
    <>
      <Select
        style={{ width: '20%', marginLeft: '10px' }}
        variant={'standard'}
        value={RuleResultType[rule.result.type]}
        onChange={hanleTypeChange}
      >
        <MenuItem value={RuleResultType[RuleResultType.FromValue]}>set value as</MenuItem>
        <MenuItem value={RuleResultType[RuleResultType.FromProperty]}>use value from</MenuItem>
      </Select>
      {rule.result.type === RuleResultType.FromValue && (
        <TextField
          style={{ width: '15%', marginLeft: '10px' }}
          value={rule.result.value}
          variant={'standard'}
          onChange={handleValueChange}
        />
      )}
      {rule.result.type === RuleResultType.FromProperty && (
        <Select
          style={{ width: '15%', marginLeft: '10px' }}
          variant={'standard'}
          value={rule.result.property}
          onChange={handlePropertyChange}
        >
          <MenuItem value={Property.Currency}>Currency column</MenuItem>
          <MenuItem value={Property.Details}>Details column</MenuItem>
          <MenuItem value={Property.MCC}>MCC column</MenuItem>
        </Select>
      )}
    </>
  );
};

export default Result;
