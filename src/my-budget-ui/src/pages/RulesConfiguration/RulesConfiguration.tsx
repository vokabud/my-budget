import { Box, Button, IconButton, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { FC, useState } from 'react';

import FileLoader from 'common/FileLoader';
import Section from 'common/Section';
import FlexRow from 'common/FlexRow';
import { IRules, IRule, RuleCondition, Property, RuleResultType } from 'types';

import Rule from './Rule'
import { DragDropContext, Droppable, OnDragEndResponder } from 'react-beautiful-dnd';

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
      id: Math.random().toString(36).substring(7),
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
      id: Math.random().toString(36).substring(7),
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

  const onDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination) {
      return;
    }

    if (!data) {
      return;
    }

    const items = Array.from(data.subCategories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setData({
      ...data,
      subCategories: items
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
            {/* {data.categories.map((rule, index) => (
              <Rule
                key={index}
                rule={rule}
                index={index}
                onChange={(rule: IRule) => onCategoryRuleChangeHandler(index, rule)}
                onDelete={() => onDeleteCategoryRuleHandler(index)}
              />
            ))} */}
          </Section>
          <Section>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">

                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      padding: '10px',
                      border: snapshot.isDraggingOver
                        ? '1px solid lightgrey '
                        : '1px solid transparent',
                    }}
                  >
                    {data.subCategories.map((rule, index) => (
                      <Rule
                        key={index}
                        rule={rule}
                        index={index}
                        onChange={(rule: IRule) => onSubCategoryRuleChangeHandler(index, rule)}
                        onDelete={() => onDeleteSubCategoryRuleHandler(index)}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <Typography variant={'h5'}>
              Subcategories rules
              <IconButton onClick={addSubcategoryRuleHandler} title={'Add sub-category rule'}>
                <Add />
              </IconButton>
            </Typography>
            {/* {data.subCategories.map((rule, index) => (
              <Rule
                key={index}
                rule={rule}
                index={index}
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
