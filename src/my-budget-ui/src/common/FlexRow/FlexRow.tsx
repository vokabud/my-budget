import { Box } from "@mui/material";
import { FC, ReactNode } from "react";

interface IProps {
    children: ReactNode;
}

const FlexRow: FC<IProps> = ({
    children,
}) => (
    <Box
        display={'flex'}
        alignItems={'center'}
        padding={'10px'}
    >
        {children}
    </Box>
)

export default FlexRow;
