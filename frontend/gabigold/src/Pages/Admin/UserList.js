import React, { useState, useEffect } from "react";
import axiosInstance from "../../components/utils/axiosinterceptor";
import { Table, Button, Modal, Form, Container } from "react-bootstrap";
import { BACKEND_URL } from "../../components/utils/api";
import { toast } from "react-toastify";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = sessionStorage.getItem("access_token") || localStorage.getItem("access_token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(`${BACKEND_URL}/users/users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("خطا در دریافت کاربران:", error);
      toast.error("خطا در دریافت کاربران");
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedUser({ ...selectedUser, [name]: checked });
  };

  const handleSaveChanges = async () => {
    try {
      const updatedUserData = {
        first_name: selectedUser.first_name,
        last_name: selectedUser.last_name,
        email: selectedUser.email,
        city: selectedUser.city,
        state: selectedUser.state,
        address: selectedUser.address,
        postal_code: selectedUser.postal_code,
        gender: selectedUser.gender,
        is_active: selectedUser.is_active,
        is_admin: selectedUser.is_admin,
        is_staff: selectedUser.is_staff,
      };
      await axiosInstance.patch(`${BACKEND_URL}/users/users/${selectedUser.user_id}/`, updatedUserData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("کاربر با موفقیت به‌روزرسانی شد");
      handleModalClose();
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("خطا در به‌روزرسانی کاربر:", error);
      toast.error("خطا در به‌روزرسانی کاربر");
    }
  };

  return (
    <Container className="my-5 font-fa">
      <h3 className="mb-4 text-primary">مدیریت کاربران</h3>
      {users.length > 0 ? (
        <Table striped borderless hover responsive className="shadow-sm">
          <thead>
            <tr>
              <th>شناسه</th>
              <th>شماره تلفن</th>
              <th>نام</th>
              <th>نام خانوادگی</th>
              <th>ایمیل</th>
              <th>شهر</th>
              <th>استان</th>
              <th>آدرس</th>
              <th>کد پستی</th>
              <th>جنسیت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>
                  <Button variant="link" onClick={() => handleEditClick(user)}>
                    {user.phone_number}
                  </Button>
                </td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.city}</td>
                <td>{user.state}</td>
                <td>{user.address}</td>
                <td>{user.postal_code}</td>
                <td>{user.gender}</td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => handleEditClick(user)}>
                    ویرایش
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>هیچ کاربری یافت نشد.</p>
      )}

      {selectedUser && (
        <Modal show={showModal} onHide={handleModalClose} dir="rtl" className="font-fa">
          <Modal.Header closeButton className="flex-column-reverse">
            <Modal.Title>ویرایش کاربر</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>نام</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={selectedUser.first_name || ""}
                  onChange={handleInputChange}
                  className="w-75"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>نام خانوادگی</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={selectedUser.last_name || ""}
                  onChange={handleInputChange}
                  className="w-75"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>ایمیل</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={selectedUser.email || ""}
                  onChange={handleInputChange}
                  className="w-75"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>شهر</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={selectedUser.city || ""}
                  onChange={handleInputChange}
                  className="w-75"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>استان</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  value={selectedUser.state || ""}
                  onChange={handleInputChange}
                  className="w-75"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>آدرس</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={selectedUser.address || ""}
                  onChange={handleInputChange}
                  className="w-75"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>کد پستی</Form.Label>
                <Form.Control
                  type="text"
                  name="postal_code"
                  value={selectedUser.postal_code || ""}
                  onChange={handleInputChange}
                  className="w-75"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>جنسیت</Form.Label>
                <Form.Select
                  name="gender"
                  value={selectedUser.gender || ""}
                  onChange={handleInputChange}
                >
                  <option value="مرد">مرد</option>
                  <option value="زن">زن</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="فعال"
                  name="is_active"
                  checked={selectedUser.is_active}
                  onChange={handleCheckboxChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="مدیر"
                  name="is_admin"
                  checked={selectedUser.is_admin}
                  onChange={handleCheckboxChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="کارمند"
                  name="is_staff"
                  checked={selectedUser.is_staff}
                  onChange={handleCheckboxChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="معتمد"
                  name="is_trusted"
                  checked={selectedUser.is_trusted}
                  onChange={handleCheckboxChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              بستن
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              ذخیره تغییرات
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default UserList;
