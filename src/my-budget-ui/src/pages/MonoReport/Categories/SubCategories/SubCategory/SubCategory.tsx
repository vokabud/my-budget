import React, { FC } from 'react';
import { Collapse, IconButton, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

import { ISubCategory } from 'types';

import Expenses from '../Expenses';

interface IProps {
    subCategory: ISubCategory;
}

const SubCategory: FC<IProps> = ({ subCategory }) => {
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
            <ListItem style={{ padding: 0 }}>
                <ListItemIcon>
                    <IconButton onClick={handleClick}>
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </ListItemIcon>
                <ListItemText
                    primary={subCategory.name}
                    secondary={subCategory.total}
                />
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Expenses expenses={subCategory.expenses || []} />
            </Collapse>
        </>
    );
};

export default SubCategory;
