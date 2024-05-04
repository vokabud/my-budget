import { Container, Paper } from '@mui/material';
import { FC, useState } from 'react';

import FileLoader from 'common/FileLoader';
import Section from 'common/Section';
import FlexRow from 'common/FlexRow';
import { IRule } from 'types';

const RulesConfigurator: FC = () => {
    const [data, setData] = useState<IRule[]>([]);

    const onFileContentHandler = (content: string) => {
        try {
            const parsedData: IRule[] = JSON.parse(content);
            setData(parsedData);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Container>
            <Section>
                <FlexRow>
                    <FileLoader onFileContent={onFileContentHandler} />
                </FlexRow>
            </Section>
            <Section>
                {data.map((rule, index) => (
                    <div key={index}>
                        <p>{rule.property}</p>
                        <p>{rule.condition}</p>
                        <p>{rule.value}</p>
                        <p>{rule.result.type}</p>
                        <p>{rule.result.value}</p>
                        <p>{rule.result.property}</p>
                    </div>
                ))}
            </Section>
        </Container>
    );
};

export default RulesConfigurator;