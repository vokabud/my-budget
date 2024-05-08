import { FC, useEffect, useState } from 'react';
import { MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';

import {
  IRule,
  Property,
  RuleResultType,
} from 'types';

interface IProps {
  value: IRule;
}

const Result: FC<IProps> = ({ value }) => {
  const [rule, setRule] = useState<IRule | null>(null);

  useEffect(() => {
    setRule(value);
  }, [value]);

  const handlePropertyChange = (event: SelectChangeEvent) => {
    const property = event.target.value as Property;

    if (property && rule) {
      setRule({ ...rule, result: { ...rule.result, property: property } });
    }
  };

  const hanleTypeChange = (event: SelectChangeEvent) => {
    const type = event.target.value;

    if (type && rule) {
      setRule({
        ...rule,
        result: {
          ...rule.result,
          type: type == RuleResultType[RuleResultType.FromValue]
            ? RuleResultType.FromValue
            : RuleResultType.FromProperty
        }
      });
    }
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value && rule) {
      setRule({ ...rule, result: { ...rule.result, value: value } });
    }
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
          style={{ width: '20%', marginLeft: '10px' }}
          value={rule.result.value}
          variant={'standard'}
          onChange={handleValueChange}
        />
      )}
      {rule.result.type === RuleResultType.FromProperty && (
        <Select
          style={{ width: '20%', marginLeft: '10px' }}
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
