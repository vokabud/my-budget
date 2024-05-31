import { Box, IconButton, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import { IRule } from 'types';
import Condition from './Condition';
import Result from './Result';
import { Delete, ImportExport } from '@mui/icons-material';
import { Draggable } from 'react-beautiful-dnd';

interface IProps {
  rule: IRule;
  index: number
  onChange: (rule: IRule) => void;
  onDelete: () => void;
}

const Rule: FC<IProps> = ({
  rule,
  index,
  onChange,
  onDelete
}) => {

  if (rule === null) {
    return null;
  }

  // return (
  //   <Box
  //     marginTop={'10px'}
  //   >
  //     <Typography display={'inline'}>
  //       If
  //     </Typography>
  //     <Condition rule={rule} onChange={onChange} />
  //     <Typography display={'inline'} marginLeft={'10px'}>
  //       , then
  //     </Typography>
  //     <Result rule={rule} onChange={onChange} />
  //     <IconButton onClick={onDelete} size={'small'}>
  //       <Delete />
  //     </IconButton>
  //     <IconButton size={'small'}>
  //       <ImportExport />
  //     </IconButton>
  //   </Box>
  // );

  return (
    <Draggable index={index} draggableId={rule.id}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            ...provided.draggableProps.style,
            background: snapshot.isDragging
              ? 'pink'
              : 'transparent',
          }}
        >
          <Typography display={'inline'}>
            If
          </Typography>
          <Condition rule={rule} onChange={onChange} />
          <Typography display={'inline'} marginLeft={'10px'}>
            , then
          </Typography>
          <Result rule={rule} onChange={onChange} />
          <IconButton onClick={onDelete} size={'small'}>
            <Delete />
          </IconButton>
          <IconButton size={'small'} {...provided.dragHandleProps}>
            <ImportExport />
          </IconButton>
        </Box>

      )}
    </Draggable>
  );
};

export default Rule;
