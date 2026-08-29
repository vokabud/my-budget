import { FC, useState } from 'react';
import { DragDropContext, Draggable, Droppable, type OnDragEndResponder } from '@hello-pangea/dnd';

import Section from 'common/Section';
import { reorder } from 'common/reorder';

const INITIAL_LIST = [
  {
    id: '1',
    firstName: 'Robin',
    lastName: 'Wieruch',
  },
  {
    id: '2',
    firstName: 'Aiden',
    lastName: 'Kettel',
  },
  {
    id: '3',
    firstName: 'Jannet',
    lastName: 'Layn',
  },
];

const Item = ({ index, item }: { index: number, item: any }) => (
  <Draggable index={index} draggableId={item.id}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        style={{
          // default item style
          padding: '8px 16px',
          // default drag style
          ...provided.draggableProps.style,
          // customized drag style
          background: snapshot.isDragging
            ? 'pink'
            : 'transparent',
        }}
      >
        <div {...provided.dragHandleProps}>DRAG AREA HERE</div>
        {item.firstName} {item.lastName}
      </div>
    )}
  </Draggable>
);

const ExpenseReport: FC = () => {
  const [list, setList] = useState(INITIAL_LIST);

  const onDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination) {
      return;
    }

    setList(reorder(list, result.source.index, result.destination.index));
  };
  //https://www.robinwieruch.de/react-drag-and-drop/
  return (
    <Section>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
               // minHeight: '500px',
               // border: '1px solid black',
                background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                borderRadius: snapshot.isDraggingOver ? '16px' : '0px',
              }}
            >
              {list.map((item, index) => (
                <Item key={item.id} index={index} item={item} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Section>
  );
};

export default ExpenseReport;
