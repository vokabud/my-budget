import { Box, IconButton, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import { IRule } from 'types';
import Condition from './Condition';
import Result from './Result';
import { Delete } from '@mui/icons-material';

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
        <IconButton onClick={() => {}} size={'small'}>
          <Delete />
        </IconButton>
      </Box>
    </>
  );
};

export default Rule;
