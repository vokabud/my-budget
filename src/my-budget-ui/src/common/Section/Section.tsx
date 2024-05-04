import { Paper } from "@mui/material";
import { FC, ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

const Section: FC<IProps> = ({
  children
}) => (
  <Paper
    style={{
      padding: '10px',
      margin: '10px 0'
    }}
    elevation={3}
  >
    {children}
  </Paper>
)

export default Section;
