import { FC } from 'react';
import Section from 'common/Section';
import data from './mcc.json';

interface IMccGroup {
  type: string;
  description: string;

}

interface IMcc {
  mcc: string;
  group: IMccGroup;
  shortDescription: string;
  fullDescription: string;
}

const MCC: FC = () => {
  return (
    <Section>
      {data.map((item: IMcc) => (
        <div key={item.mcc}>{item.mcc} {item.group.type} {item.shortDescription}</div>
      ))}
    </Section>
  );
};

export default MCC;