import { Container } from '@mui/material';
import { FC, useState } from 'react';

import FileLoader from 'common/FileLoader';
import Section from 'common/Section';
import FlexRow from 'common/FlexRow';
import { IRule } from 'types';

import Rule from './Rule'

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

  const onRuleChangeHandler = (id: number, rule: IRule) => {
    const updatedData = [...data];
    updatedData[id] = rule;
    setData(updatedData);
  }

  return (
    <>
      <Section>
        <FlexRow>
          <FileLoader onFileContent={onFileContentHandler} />
        </FlexRow>
      </Section>
      {data.length > 0 && (
        <Section>
          {data.map((rule, index) => (
            <Rule
              key={index}
              rule={rule}
              onChange={(rule: IRule) => onRuleChangeHandler(index, rule)}
            />
          ))}
        </Section>
      )}
      <Section>
        {JSON.stringify(data)}
      </Section>
    </>
  );
};

export default RulesConfigurator;
