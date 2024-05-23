import { FC, useState } from 'react';
import { DragDropContext, Droppable, OnDragEndResponder, Draggable } from 'react-beautiful-dnd';

import Section from 'common/Section';

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

const ExpenseReport: FC = () => {
  const [list, setList] = useState(INITIAL_LIST);

  const onDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(list);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setList(items);
  };
//https://www.robinwieruch.de/react-drag-and-drop/
  return (
    <Section>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {list.map((item, index) => (
                <Draggable
                  index={index}
                  draggableId={item.id}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
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
                      {item.firstName} {item.lastName}
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Section>
  );
};

export default ExpenseReport;
