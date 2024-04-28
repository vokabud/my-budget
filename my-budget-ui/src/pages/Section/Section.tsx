import { Box } from "@mui/material";
import { FC, ReactNode } from "react";

interface IProps {
    children: ReactNode;
}

const Section: FC<IProps> = ({
    children
}) => (
    <Box
        display={'flex'}
        alignItems={'center'}
        border={'1px solid gray'}
        padding={'10px'}
        marginTop={'10px'}
        borderRadius={'5px'}
    >
        {children}
    </Box>
);;

export default Section;
