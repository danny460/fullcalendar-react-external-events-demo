import './App.scss';

import React, { useEffect, useRef } from 'react';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'

/**
 * generic draggable item wrapper
 */
function ExternalDraggableItem({ itemId, eventData, children }) {
  return (
    <div id={itemId} data-event={JSON.stringify(eventData)}>
      { children }
    </div>
  )
}

/**
 * generic draggable area
 */
function ExternalDraggableArea({ items, renderItem, itemId, keyExtractor, eventDataExtractor }) {
  // ref will be used for creating Draggable.
  const draggableEl = useRef(null);
  
  useEffect(() => {
    if(draggableEl) {
      // initialize draggable, ideally should only run once because
      // draggableEl should not change.
      // use ref.current to get reference to the DOM element
      new Draggable(draggableEl.current, {
        itemSelector: `#${itemId}`,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [draggableEl]);

  return (
    <div ref={draggableEl} className="drag-area">
      {
        items.map((item, index) => {
          return (
            <ExternalDraggableItem itemId={itemId} key={keyExtractor(item, index)} eventData={eventDataExtractor(item)}>
              { renderItem(item) }
            </ExternalDraggableItem>
          )
        })
      }
    </div>
  )
}

ExternalDraggableArea.defaultProps = {
  items: [],
  renderItem: () => {}, // no-op
  itemId: 'draggable-item', // required
  keyExtractor: (_item, index) => index, // default taking index
  eventDataExtractor: item => item, // pass-thru
}

const draggableItems = [
  { id: 'abc', title: 'event 1', url: 'http://localhost:3000/events/abc', color: 'red' },
  { id: 'xyz', title: 'event 2', url: 'http://localhost:3000/events/xyz' },
  { id: 'dsf', title: 'event 3', url: 'http://localhost:3000/events/dsf' },
]

export default function App() {
  // const handleDrop = () => {}
  // const handleEventReceive = ({ draggedEl, event, view }) => { console.log({draggedEl, event, view}) }

  return (
    <>
      <ExternalDraggableArea 
        items={draggableItems} 
        renderItem={({ title }) => <div className="drag-area-item">{title}</div>} 
        itemId="drag-area-item"
        eventDataExtractor={({ id, ...rest }) => rest}
        keyExtractor={({ id }) => id } 
      />
      <FullCalendar
        defaultView="dayGridMonth" 
        plugins={[ dayGridPlugin, interactionPlugin ]}
        editable
        droppable 
        eventClick={console.log.bind(console)}
        // drop={handleDrop}
        // eventReceive={handleEventReceive}
      />
    </>
  )
}