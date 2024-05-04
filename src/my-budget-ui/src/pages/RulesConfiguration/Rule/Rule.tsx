import { Typography } from '@mui/material';
import { FC } from 'react';

import {
    IRule,
    Property,
    RuleCondition,
    RuleResultType,
} from 'types';

interface IProps {
    rule: IRule;
}

const Rule: FC<IProps> = ({ rule }) => {
    return (
        <Typography>
            If property {Property[rule.property]} is {RuleCondition[rule.condition]} {rule.value} then set {RuleResultType[rule.result.type]} to {rule.result.value} for property {Property[rule.result.property]}
        </Typography>
    );
};

export default Rule;
