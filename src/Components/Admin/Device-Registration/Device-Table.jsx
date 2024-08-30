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

const DeviceTable = () => {
  const [dragIndex, setDragIndex] = useState({
    active: -1,
    over: -1,
  });
  const [columns, setColumns] = useState([
    {
      title: 'Device Name',
      dataIndex: 'deviceName',
    },
    {
      title: 'Serial Number',
      dataIndex: 'serialNumber',
    },
    {
      title: 'Device Color',
      dataIndex: 'deviceColor',
    },
    {
      title: 'Device Brand',
      dataIndex: 'deviceBrand',
    },
  ]);
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const fetchData = async () => {
    try {
      // const response = await axios.get('https://macts-backend-webapp-production-0bd2.up.railway.app/DeviceList');
      const response = await axios.get('https://macts-backend-webapp.onrender.com/DeviceList');
      const responseData = response.data;
      const transformedData = responseData.map((item, index) => ({
        key: `${index + 1}`,
        deviceName: item.device_name,
        serialNumber: item.device_serialNumber,
        deviceColor: item.device_color,
        deviceBrand: item.device_brand,
      }));
      setData(transformedData);
    } catch (error) {
      console.error('Error fetching device data:', error);
    }
  };
  
  useEffect(() => {
    fetchData();

    // Polling mechanism to fetch data every 5 seconds
    const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) =>
      Object.values(item).some((value) => value.toLowerCase().includes(searchText.toLowerCase()))
    );
    setFilteredData(filtered.reverse());
  }, [searchText, data]);

  const handleSearch = () => {
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
        <p className="text-xl font-bold mb-2">Device List</p>
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

export default DeviceTable;
