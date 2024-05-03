import { Box } from "@mui/material";
import { FC, ReactNode } from "react";

interface IProps {
    children: ReactNode;
    show: boolean;
}

const Section: FC<IProps> = ({
    children,
    show
}) => {
    if (!show) {
        return null;
    }

    return (
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
    );
}

export default Section;
