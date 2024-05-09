import { Container, Typography } from '@mui/material';
import { FC, useState } from 'react';

import FileLoader from 'common/FileLoader';
import Section from 'common/Section';
import FlexRow from 'common/FlexRow';
import { IRules, IRule } from 'types';

import Rule from './Rule'

const RulesConfigurator: FC = () => {
  const [data, setData] = useState<IRules | null>(null);

  const onFileContentHandler = (content: string) => {
    try {
      const parsedData: IRules = JSON.parse(content);
      setData(parsedData);
    } catch (error) {
      console.error(error);
    }
  }

  const onCategoryRuleChangeHandler = (id: number, rule: IRule) => {
    if (!data) {
      return;
    }

    var categories = [...data.categories];
    categories[id] = rule;

    setData({
      ...data,
      categories: categories
    });
  }

  const onSubCategoryRuleChangeHandler = (id: number, rule: IRule) => {
    if (!data) {
      return;
    }

    var subCategories = [...data.subCategories];
    subCategories[id] = rule;

    setData({
      ...data,
      subCategories: subCategories
    });
  }

  return (
    <>
      <Section>
        <FlexRow>
          <FileLoader onFileContent={onFileContentHandler} />
        </FlexRow>
      </Section>
      {data && (
        <>
          <Section>
            <Typography variant={'h5'}>
              Categories rules
            </Typography>
            {data.categories.map((rule, index) => (
              <Rule
                key={index}
                rule={rule}
                onChange={(rule: IRule) => onCategoryRuleChangeHandler(index, rule)}
              />
            ))}
          </Section>
          <Section>
            <Typography variant={'h5'}>
              Subcategories rules
            </Typography>
            {data.subCategories.map((rule, index) => (
              <Rule
                key={index}
                rule={rule}
                onChange={(rule: IRule) => onSubCategoryRuleChangeHandler(index, rule)}
              />
            ))}
          </Section>
        </>
      )}
      <Section>
        {JSON.stringify(data)}
      </Section>
    </>
  );
};

export default RulesConfigurator;
