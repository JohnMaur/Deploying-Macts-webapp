import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { SearchOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import axios from 'axios';

const DragIndexContext = createContext({
  active: -1,
  over: -1,
});

const dragActiveStyle = (dragState, id) => {
  const { active, over, direction } = dragState;
  let style = {};
  if (active && active === id) {
    style = {
      backgroundColor: 'gray',
      opacity: 0.5,
    };
  } else if (over && id === over && active !== over) {
    style =
      direction === 'right'
        ? {
            borderRight: '1px dashed gray',
          }
        : {
            borderLeft: '1px dashed gray',
          };
  }
  return style;
};

const TableBodyCell = (props) => {
  const dragState = useContext(DragIndexContext);
  return <td {...props} style={{ ...props.style, ...dragActiveStyle(dragState, props.id) }} />;
};

const TableHeaderCell = (props) => {
  const dragState = useContext(DragIndexContext);
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: props.id,
  });
  const style = {
    ...props.style,
    cursor: 'move',
    ...(isDragging
      ? {
          position: 'relative',
          zIndex: 9999,
          userSelect: 'none',
        }
      : {}),
    ...dragActiveStyle(dragState, props.id),
  };
  return <th {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};

const GatepassTable = () => {
  const [dragIndex, setDragIndex] = useState({
    active: -1,
    over: -1,
  });
  const [columns, setColumns] = useState([
    {
      title: 'TUPT ID',
      dataIndex: 'tuptId',
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Course',
      dataIndex: 'course',
    },
    {
      title: 'Section',
      dataIndex: 'section',
    },
    {
      title: 'Date',
      dataIndex: 'date',
    },
  ]);
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try { 
        // const response = await axios.get('https://macts-backend-webapp-production-0bd2.up.railway.app/Gatepass-Report');
        // const response = await axios.get('http://localhost:2526/Gatepass-Report');
        const response = await axios.get('https://macts-backend-webapp.onrender.com/Gatepass-Report');
        const responseData = response.data;
        const transformedData = responseData.map((item, index) => ({
          key: `${index + 1}`,
          tuptId: item.gatepass_tupID,
          name: `${item.gatepass_firstname} ${item.gatepass_middlename} ${item.gatepass_lastname}`,
          course: item.gatepass_course,
          section: item.gatepass_section,
          date: item.gatepass_historyDate,
        }));
        setData(transformedData);
      } catch (error) {
        console.error('Error fetching RFID data:', error);
      }
    };

    fetchData();
  }, []);
  

  useEffect(() => {
    // Filter data based on search text
    const filtered = data.filter((item) =>
      Object.values(item).some((value) => value.toLowerCase().includes(searchText.toLowerCase()))
    );
    // Reverse the filtered array to ensure the latest data is displayed first
    setFilteredData(filtered.reverse());
  }, [searchText, data]); // Include 'data' dependency here

  const handleSearch = () => {
    // Triggered when the search button is clicked
    // You can also add more complex search logic here
    // For now, let's just set the search text state
    setSearchText(searchText);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setColumns((prevState) => {
        const activeIndex = prevState.findIndex((i) => i.dataIndex === active?.id);
        const overIndex = prevState.findIndex((i) => i.dataIndex === over?.id);
        return arrayMove(prevState, activeIndex, overIndex);
      });
    }
    setDragIndex({
      active: -1,
      over: -1,
    });
  };

  const onDragOver = ({ active, over }) => {
    const activeIndex = columns.findIndex((i) => i.dataIndex === active.id);
    const overIndex = columns.findIndex((i) => i.dataIndex === over?.id);
    setDragIndex({
      active: active.id,
      over: over?.id,
      direction: overIndex > activeIndex ? 'right' : 'left',
    });
  };

  const pagination = {
    pageSize: 5,
    position: ['bottomCenter'],
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-xl font-bold mb-2">Gatepass Report</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div className="rounded-sm shadow-md border-[1px] border-solid border-gray-500 focus:outline-none">
            <input
              className="p-2 px-5 placeholder-gray-500"
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button className="p-2 px-3 border-solid border-l-[1px] border-gray-500" onClick={handleSearch}>
              <SearchOutlined />
            </button>
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        collisionDetection={closestCenter}
      >
        <SortableContext items={columns.map((i) => i.dataIndex)} strategy={horizontalListSortingStrategy}>
          <DragIndexContext.Provider value={dragIndex}>
            <Table
              rowKey="key"
              columns={columns}
              dataSource={filteredData}
              components={{
                header: {
                  cell: TableHeaderCell,
                },
                body: {
                  cell: TableBodyCell,
                },
              }}
              pagination={pagination}
            />
          </DragIndexContext.Provider>
        </SortableContext>
        <DragOverlay>
          <th
            style={{
              backgroundColor: 'gray',
              padding: 16,
            }}
          >
            {columns[columns.findIndex((i) => i.dataIndex === dragIndex.active)]?.title}
          </th>
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default GatepassTable;
