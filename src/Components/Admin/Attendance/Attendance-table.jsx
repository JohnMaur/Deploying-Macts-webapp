import React, { useState, useEffect, createContext, useContext } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { message } from 'antd';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { arrayMove, horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { SearchOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';

const customModalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10000,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '80%',
    width: '600px',
  },
};

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
  return <td {...props} style={{ ...props.style, ...dragActiveStyle(dragState, props.id) }}>{props.children}</td>;
};

const TableHeaderCell = (props) => {
  const dragState = useContext(DragIndexContext);
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: props.id,
  });
  const style = {
    ...props.style,
    cursor: 'move',
    zIndex: isDragging ? 9999 : 1,
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

const AddAttendanceModal = ({ isVisible, onClose, addAttendance }) => {
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (isVisible) {
      const randomCode = Math.random().toString(36).slice(2);
      setCode(randomCode);
    }
  }, [isVisible]);

  const handleAddAttendance = () => {
    const attendanceData = {
      attendance_description: description,
      attendance_code: code,
      attendance_date: date.toLocaleString(),
    };

    // axios.post('https://macts-backend-webapp-production-0bd2.up.railway.app/add-Attendance', attendanceData)
    axios.post('https://macts-backend-webapp.onrender.com/add-Attendance', attendanceData)
      .then(response => {
        console.log('Attendance added successfully');
        addAttendance(attendanceData); // Update attendance data in parent
        setDescription(''); // Clear description input
        setCode(''); // Clear code input
        setDate(new Date()); // Reset date input
        onClose();
        message.success({
          content: 'Attendance added successfully',
          duration: 3, // Duration in seconds
          style: {
            fontSize: '20px', // Adjust font size
          },
        });
      })
      .catch(error => {
        console.error('Error adding attendance:', error);
        message.error({
          content: 'Failed to add attendance',
          duration: 3, // Duration in seconds
          style: {
            fontSize: '16px', // Adjust font size
          },
        });
      });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[10000]">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Add Attendance</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Attendance Description</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Auto Generated Code</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={code}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Raise Period Date</label>
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            showTimeSelect
            timeFormat="h:mm aa"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex justify-end">
          <button
            className="text-white bg-blue-500 hover:bg-blue-700 active:opacity-40 transition-all font-bold py-2 px-6 rounded mr-4"
            onClick={handleAddAttendance}
          >
            ADD
          </button>
          <button
            className="text-white bg-red-500 hover:bg-red-700 active:opacity-40 transition-all font-bold py-2 px-4 rounded mr-2"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const AttendanceTable = () => {
  const navigate = useNavigate();
  const [dragIndex, setDragIndex] = useState({
    active: -1,
    over: -1,
  });
  const [columns, setColumns] = useState([
    {
      title: 'Attendance Description',
      dataIndex: 'attendance_description',
      key: 'attendance_description',
    },
    {
      title: 'Code',
      dataIndex: 'attendance_code',
      key: 'attendance_code',
    },
    {
      title: 'Raise Period Date',
      dataIndex: 'attendance_date',
      key: 'attendance_date',
    },
  ]);
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get('https://macts-backend-webapp-production-0bd2.up.railway.app/attendance');
        const response = await axios.get('https://macts-backend-webapp.onrender.com/attendance');
        const responseData = response.data;
        const transformedData = responseData.map((item) => ({
          key: item.attendance_id.toString(),
          attendance_description: item.attendance_description,
          attendance_code: item.attendance_code,
          attendance_date: item.attendance_date,
        }));
        setData(transformedData.reverse());
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredData(
      data.filter((item) =>
        Object.values(item).some((value) =>
          value.toLowerCase().includes(searchText.toLowerCase())
        )
      )
    );
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

  const handleRowClick = (record) => {
    navigate(`/attendance/report/${record.attendance_code}`);
  };

  const addAttendance = (attendanceData) => {
    const newRecord = {
      key: new Date().toString(),
      attendance_description: attendanceData.attendance_description,
      attendance_code: attendanceData.attendance_code,
      attendance_date: attendanceData.attendance_date,
    };
    setData((prevData) => [newRecord, ...prevData]);
    setFilteredData((prevData) => [newRecord, ...prevData]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <button
          className="text-white bg-blue-500 hover:bg-blue-700 active:opacity-40 transition-all font-bold py-2 px-4 rounded"
          onClick={() => setIsModalVisible(true)}
        >
          Add Attendance
        </button>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md"
            onClick={handleSearch}
          >
            <SearchOutlined />
          </button>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        modifiers={[restrictToHorizontalAxis]}
      >
        <DragIndexContext.Provider value={dragIndex}>
          <SortableContext items={columns.map((i) => i.dataIndex)} strategy={horizontalListSortingStrategy}>
            <Table
              dataSource={filteredData}
              columns={columns.map((col) => ({
                ...col,
                onCell: (record) => ({
                  onClick: () => handleRowClick(record),
                  style: { cursor: 'pointer' },
                }),
                onHeaderCell: (col) => ({
                  id: col.dataIndex,
                }),
                title: col.title,
                dataIndex: col.dataIndex,
                key: col.dataIndex,
              }))}
              pagination={pagination}
              components={{
                header: {
                  cell: TableHeaderCell,
                },
                body: {
                  cell: TableBodyCell,
                },
              }}
            />
          </SortableContext>
        </DragIndexContext.Provider>
      </DndContext>
      <AddAttendanceModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} addAttendance={addAttendance} />
    </div>
  );
};

export default AttendanceTable;
