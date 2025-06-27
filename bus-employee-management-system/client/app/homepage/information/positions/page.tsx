'use client';

import React from 'react';
import styles from './positions.module.css';
import "@/styles/filters.css";
import "@/styles/pagination.css";
import PositionsModal from '@/components/modal/information/PositionsModalLogic';
import { PositionsLogic } from './positionsLogic';
import PaginationComponent from '@/components/ui/pagination';

const PositionsPage = () => {
  const {
    filteredPositions,
    searchTerm,
    setSearchTerm,
    paginatedPositions,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedPosition,
    setSelectedPosition,
    positions,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
    openActionDropdownIndex,
    toggleActionDropdown,
  } = PositionsLogic();

  return (
    <div className={styles.base}>
      <div className={styles.positionsContainer}>
        <h1 className={styles.title}>Positions List</h1>

        <div className={styles.headerSection}>
          <div className={styles.search}>
            <i className='ri-search-line' />
            <input
              type="text"
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => setShowAddModal(true)} className={styles.addPositionsButton}>
            <i className='ri-add-line' />
            Add Position
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.positionsTable}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Position</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPositions.map((pos, index) => (
                <tr key={pos.name}>
                  <td>{(currentPage - 1) * pageSize + index + 1}</td>
                  <td>{pos.name}</td>
                  <td>{pos.department}</td>
                  <td className={styles.actionCell}>
                    <button
                      className={styles.mainActionButton}
                      onClick={() => toggleActionDropdown(index)}
                    >
                      <i className="ri-more-2-fill" />
                    </button>
                    {openActionDropdownIndex === index && (
                      <div className={styles.actionDropdown}>
                        <button
                          className={styles.editButton}
                          onClick={() => {
                            setSelectedPosition(pos);
                            setShowEditModal(true);
                            toggleActionDropdown(null);
                          }}
                        >
                          <i className='ri-edit-2-line' /> Edit
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => {
                            handleDeleteRequest(pos.name);
                            toggleActionDropdown(null);
                          }}
                        >
                          <i className='ri-delete-bin-line' /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />

        {showAddModal && (
          <PositionsModal
            isEdit={false}
            existingPositions={positions.map(p => p.name)}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAdd}
          />
        )}

        {showEditModal && selectedPosition && (
          <PositionsModal
            isEdit={true}
            defaultValue={selectedPosition.name}
            defaultDepartment={selectedPosition.department}
            existingPositions={positions.map(p => p.name)}
            onClose={() => setShowEditModal(false)}
            onSubmit={handleEdit}
          />
        )}
      </div>
    </div>
  );
};

export default PositionsPage;