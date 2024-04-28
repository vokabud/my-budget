import { Box, Container, Typography } from '@mui/material';
import { FC, useState } from 'react';
import FileLoader from './FileLoader';
import { IReport } from '../types';
import Categories from './Categories';
import Section from './Section';

const Main: FC = () => {
    const [data, setData] = useState<IReport | null>(null);

    const onFileContentHandler = (content: string) => {
        try {
            const parsedData: IReport = JSON.parse(content);
            console.log(parsedData);
            setData(parsedData);
            console.log(parsedData);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Container>
            <Section>
                <FileLoader onFileContent={onFileContentHandler} />
            </Section>
            <Section>
                <Typography variant="h6" component="h1">
                    {`From ${data?.startDate} To ${data?.endDate}`}
                </Typography>
            </Section>
            <Section>
                <Typography variant="h6" component="h1">
                    {`Total: ${data?.total}`}
                </Typography>
            </Section>
            <Section>
                <Categories categories={data?.categories || []} />
            </Section>
        </Container>
    );
};

export default Main;