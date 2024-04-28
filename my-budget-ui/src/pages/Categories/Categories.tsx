import React, { FC } from 'react';
import { List } from '@mui/material';

import { ICategory } from '../../types';

import Category from './Category';

interface IProps {
    categories: ICategory[];
}

const Categories: FC<IProps> = ({ categories }) => {
    return (
        <List
            sx={{ width: '100%', bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
        >
            {categories.map((category) => (
                <Category
                    key={category.name}
                    category={category}
                />
            ))}
        </List>
    );
};

export default Categories;