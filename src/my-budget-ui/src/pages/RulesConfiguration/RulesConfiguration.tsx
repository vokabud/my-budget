import { Button, Container, IconButton, Typography } from '@mui/material';
import { FC, useState } from 'react';
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable, DropResult, ResponderProvided } from 'react-beautiful-dnd';

import FileLoader from 'common/FileLoader';
import Section from 'common/Section';
import FlexRow from 'common/FlexRow';
import { IRules, IRule, RuleCondition, Property, RuleResultType } from 'types';

import Rule from './Rule'
import { Add } from '@mui/icons-material';

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

  const onDeleteCategoryRuleHandler = (id: number) => {
    if (!data) {
      return;
    }

    var categories = [...data.categories];
    categories.splice(id, 1);

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

  const onDeleteSubCategoryRuleHandler = (id: number) => {
    if (!data) {
      return;
    }

    var subCategories = [...data.subCategories];
    subCategories.splice(id, 1);

    setData({
      ...data,
      subCategories: subCategories
    });
  }

  const saveDataToJson = () => {
    if (!data) {
      return;
    }

    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'rules.json';
    a.click();
  }

  const addCategoryRuleHandler = () => {
    if (!data) {
      return;
    }

    const newRule: IRule = {
      condition: RuleCondition.Equals,
      property: Property.Details,
      value: '',
      result: {
        property: Property.Details,
        type: RuleResultType.FromValue,
        value: 'My category'
      }
    }

    setData({
      ...data,
      categories: [...data.categories, newRule]
    });
  }

  const addSubcategoryRuleHandler = () => {
    if (!data) {
      return;
    }

    const newRule: IRule = {
      condition: RuleCondition.Equals,
      property: Property.Details,
      value: '',
      result: {
        property: Property.Details,
        type: RuleResultType.FromValue,
        value: 'My category'
      }
    }

    setData({
      ...data,
      subCategories: [...data.categories, newRule]
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
              <IconButton onClick={addCategoryRuleHandler} title={'Add category rule'}>
                <Add />
              </IconButton>
            </Typography>
            {data.categories.map((rule, index) => (
              <Rule
                key={index}
                rule={rule}
                onChange={(rule: IRule) => onCategoryRuleChangeHandler(index, rule)}
                onDelete={() => onDeleteCategoryRuleHandler(index)}
              />
            ))}
          </Section>
          <Section>
            <Typography variant={'h5'}>
              Subcategories rules
              <IconButton onClick={addSubcategoryRuleHandler} title={'Add sub-category rule'}>
                <Add />
              </IconButton>
            </Typography>
            <DragDropContext onDragEnd={(result: DropResult, provided: ResponderProvided) => {
              console.log(result);
              console.log(provided);
             }}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{ backgroundColor: 'green', border: '1px solid red' }}
                  >
                    {data.subCategories.map((rule, index) => (
                      <Draggable
                        key={index}
                        draggableId={index.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            style={{ backgroundColor: 'yellow', border: '1px solid black', margin: '10px'}}
                          >
                            test
                            {/* <Rule
                              rule={rule}
                              onChange={(rule: IRule) => onSubCategoryRuleChangeHandler(index, rule)}
                              onDelete={() => onDeleteSubCategoryRuleHandler(index)}
                            /> */}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            {/* {data.subCategories.map((rule, index) => (
              <Rule
                key={index}
                rule={rule}
                onChange={(rule: IRule) => onSubCategoryRuleChangeHandler(index, rule)}
                onDelete={() => onDeleteSubCategoryRuleHandler(index)}
              />
            ))} */}
          </Section>
        </>
      )}
      <Section>
        <Button variant="contained" color="primary" onClick={saveDataToJson}>
          Save Data to JSON
        </Button>
      </Section>
    </>
  );
};

export default RulesConfigurator;
