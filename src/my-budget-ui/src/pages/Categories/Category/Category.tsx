import React, { FC } from 'react';
import { Collapse, IconButton, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

import { ICategory } from '../../../types';

import SubCategories from '../SubCategories';

interface IProps {
    category: ICategory;
}

const Category: FC<IProps> = ({ category }) => {
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
                    primary={category.name}
                    secondary={category.total}
                />
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <SubCategories subCategories={category.subCategories || []} />
            </Collapse>
        </>
    );
};

export default Category;