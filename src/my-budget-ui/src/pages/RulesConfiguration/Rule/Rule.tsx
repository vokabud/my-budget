import { Box, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import { IRule } from 'types';
import Condition from './Condition';
import Result from './Result';

interface IProps {
  rule: IRule;
  onChange: (rule: IRule) => void;
}

const Rule: FC<IProps> = ({ rule, onChange }) => {

  if (rule === null) {
    return null;
  }

  return (
    <>
      <Box marginTop={'10px'}>
        <Typography display={'inline'}>
          If
        </Typography>
        <Condition rule={rule} onChange={onChange} />
        <Typography display={'inline'} marginLeft={'10px'}>
          , then
        </Typography>
        <Result rule={rule} onChange={onChange} />
      </Box>
    </>
  );
};

export default Rule;
