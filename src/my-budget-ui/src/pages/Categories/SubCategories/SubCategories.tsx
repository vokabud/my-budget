import { FC } from 'react';
import { List } from '@mui/material';

import { ISubCategory } from '../../../types';

import SubCategory from './SubCategory';

interface IProps {
    subCategories: ISubCategory[];
}

const SubCategories: FC<IProps> = ({ subCategories }) => {
    return (
        <List
            sx={{ width: '100%', bgcolor: 'background.paper', paddingLeft: '40px' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
        >
            {subCategories.map((subCategory) => (
                <SubCategory
                    key={subCategory.name}
                    subCategory={subCategory}
                />
            ))}
        </List>
    );
};

export default SubCategories;