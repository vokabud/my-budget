import { Box } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import { IRule } from 'types';
import Condition from './Condition';
import Result from './Result';

interface IProps {
  value: IRule;
}

const Rule: FC<IProps> = ({ value }) => {
  const [rule, setRule] = useState<IRule | null>(null);

  useEffect(() => {
    setRule(value);
  }, [value]);

  if (rule === null) {
    return null;
  }

  return (
    <Box>
      <Condition value={rule} />
      <Result value={rule} />
    </Box>
  );
};

export default Rule;
