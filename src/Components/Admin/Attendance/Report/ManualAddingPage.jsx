import React, { useState } from 'react';
import ManualAddingAttendance from './ManualAddingAttendance'; // Adjust the import path as needed

const ManualAddingAttendancePage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <button
        onClick={openModal}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300 font-bold mt-2"
      >
        Add
      </button>
      <ManualAddingAttendance
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
      />
    </div>
  );
};

export default ManualAddingAttendancePage;
