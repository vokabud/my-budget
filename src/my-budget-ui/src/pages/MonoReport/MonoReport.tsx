import { Container, Typography } from '@mui/material';
import { FC, useState } from 'react';

import FileLoader from 'common/FileLoader';
import FlexRow from 'common/FlexRow';
import { IReport } from 'types';

import Categories from './Categories';
import Section from 'common/Section';

const MonoReport: FC = () => {
  const [data, setData] = useState<IReport | null>(null);

  const onFileContentHandler = (content: string) => {
    try {
      const parsedData: IReport = JSON.parse(content);
      setData(parsedData);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Container maxWidth="lg">
      <Section>
        <FlexRow>
          <FileLoader onFileContent={onFileContentHandler} />
        </FlexRow>
      </Section>
      {data != null && (
        <>
          <Section>
            <Typography variant="h6" component="h1">
              {`From ${data.startDate} To ${data.endDate}`}
            </Typography>
          </Section>
          <Section>
            <Typography variant="h6" component="h1">
              {`Total: ${data.total}`}
            </Typography>
          </Section>
          <Section>
            <Categories categories={data.categories || []} />
          </Section>
        </>
      )}
    </Container>
  );
};

export default MonoReport;