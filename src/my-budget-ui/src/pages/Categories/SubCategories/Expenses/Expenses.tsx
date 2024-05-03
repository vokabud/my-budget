import { FC } from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';

import { IExpense } from '../../../../types';

interface IProps {
    expenses: IExpense[];
}

const Expenses: FC<IProps> = ({ expenses }) => {


    return (
        <List
            sx={{ width: '100%', bgcolor: 'background.paper', paddingLeft: '100px' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
        >
            {expenses.sort((a, b) => a.date > b.date ? 1 : 0).map((expens) => (
                <ListItem key={expens.date} style={{ padding: 0 }}>
                    <Box width={'100%'} display={'flex'} >
                        <Typography width={'20%'}>
                            {new Date(expens.date).toLocaleString()}
                        </Typography>
                        <Typography width={'10%'}>
                            {expens.transactionAmount}
                        </Typography>
                        <Typography>
                            {expens.details}
                        </Typography>
                    </Box>
                </ListItem>
            ))}
        </List>
    );
};

export default Expenses;