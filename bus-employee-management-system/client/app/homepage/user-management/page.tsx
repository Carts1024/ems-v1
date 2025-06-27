'use client';

import React from 'react';
import styles from './user.module.css'; // Import the new user.module.css
import "@/styles/filters.css"; // Assuming these global styles are still relevant
import "@/styles/pagination.css"; // Assuming these global styles are still relevant
import { UserLogic, User } from './userLogic'; // Import UserLogic and User type
import PaginationComponent from '@/components/ui/pagination'; // Re-use existing PaginationComponent
import FilterDropdown from '@/components/ui/filterDropdown'; // Re-use existing FilterDropdown
import UserModal from '@/components/modal/usermanagement/UserModal'; // Import the new UserModal

const UserManagementPage = () => {
  const {
    searchTerm,
    setSearchTerm,
    paginatedUsers,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedUser,
    setSelectedUser,
    handleAdd,
    handleEdit,
    handleDeleteUser, // Renamed from handleDeleteRequest
    openActionDropdownIndex,
    toggleActionDropdown,
    openAddModal,
    openEditModal,
    filterSections,
    handleApplyFilters,
  } = UserLogic(); // Use the new UserLogic hook

  const [showViewModal, setShowViewModal] = React.useState(false);

  const openViewModal = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  return (
    <div className={styles.base}>
      <div className={styles.userManagementContainer}>
        <h1 className={styles.title}>User Management</h1>

        <div className={styles.headerSection}>
          <div className={styles.searchAndFilterContainer}>
            <div className={styles.search}>
              <i className="ri-search-line" aria-hidden="true"></i>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <FilterDropdown
              sections={filterSections}
              onApply={handleApplyFilters}
              className={styles.customFilterDropdown}
            />
          </div>

          <button onClick={openAddModal} className={styles.addUserButton}>
            <i className="ri-add-line" aria-hidden="true"></i> Add User
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th className={styles.firstColumn}>No.</th>
                <th>Employee Number</th>
                <th>Position</th>
                <th>Department</th>
                <th>Role (Auth)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user, index) => (
                <tr key={user.id}>
                  <td className={styles.firstColumn}>{(currentPage - 1) * pageSize + index + 1}</td>
                  <td>{user.employeeNumber}</td>
                  <td>{user.jobPosition}</td>
                  <td>{user.department}</td>
                  <td>
                    <span className={`${styles.userRoleBadge} ${styles[`role-${user.role.toLowerCase()}`]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className={styles.actionCell}>
                    <button
                      className={styles.mainActionButton}
                      onClick={() => toggleActionDropdown(index)}
                    >
                      <i className="ri-more-2-fill" aria-hidden="true"></i>
                    </button>

                    {openActionDropdownIndex === index && (
                      <div className={styles.actionDropdown}>
                        <button
                          className={styles.editButton}
                          onClick={() => {
                            openEditModal(user);
                            toggleActionDropdown(null);
                          }}
                        >
                          <i className="ri-edit-2-line" aria-hidden="true"></i> Edit
                        </button>
                        <button
                          className={styles.viewButton}
                          onClick={() => {
                            openViewModal(user);
                            toggleActionDropdown(null);
                          }}
                        >
                          <i className="ri-eye-line" aria-hidden="true"></i> View
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => {
                            handleDeleteUser(user.id);
                            toggleActionDropdown(null);
                          }}
                        >
                          <i className="ri-delete-bin-line" aria-hidden="true"></i> Delete
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
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>

      {showAddModal && (
        <UserModal
          isEdit={false}
          isView={false}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAdd}
        />
      )}

      {showEditModal && selectedUser && (
        <UserModal
          isEdit={true}
          isView={false}
          defaultValue={selectedUser}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEdit}
        />
      )}

      {showViewModal && selectedUser && (
        <UserModal
          isEdit={false}
          isView={true}
          defaultValue={selectedUser}
          onClose={() => setShowViewModal(false)}
          onSubmit={() => { /* No submission in view mode */ }}
        />
      )}
    </div>
  );
};

export default UserManagementPage;