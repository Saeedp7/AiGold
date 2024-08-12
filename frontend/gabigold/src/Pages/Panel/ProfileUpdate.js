import { useEffect, useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import axiosInstance from "../../components/utils/axiosinterceptor";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { BACKEND_URL } from "../../components/utils/api";

const ProfileUpdate = () => {
    const [inputs, setInputs] = useState({});
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [updated, setUpdated] = useState(false); // New state for triggering re-fetch
    const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axiosInstance.get(`${BACKEND_URL}/users/update_profile/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUserData(response.data);
                setInputs(response.data);
            } catch (error) {
                toast.error('مشکلی در بارگزاری رخ داده است', {
                    position: "top-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored"
                });
            }
        }
        fetchData();
    }, [token, updated]); // Added 'updated' to dependency array

    const handleChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    };

    const isValidIranianNationalCode = input => {
        if (!/^\d{10}$/.test(input)) return false;
        const check = +input[9];
        const sum = input.split('').slice(0, 9).reduce((acc, x, i) => acc + +x * (10 - i), 0) % 11;
        return sum < 2 ? check === sum : check + sum === 11;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        const { first_name, last_name, code_melli, country, state, city, postal_code, address, email, gender, phone_number } = inputs;

        if (isValidIranianNationalCode(code_melli)) {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };
                const response = await axiosInstance.patch(`${BACKEND_URL}/users/update_profile/`, {
                    first_name, last_name, code_melli, country, state, city, address, postal_code, email, gender, phone_number
                }, config);
                setUserData(response.data);
                setLoading(false);
                toast.success('اطلاعات حساب شما به روز شد', {
                    position: "top-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored"
                });
                setUpdated(!updated); // Trigger a re-fetch
            } catch (error) {
                setLoading(false);
                const errorMessage = error.response.data.code_melli ?
                    'کد ملی وارد شده در سیستم وجود دارد' :
                    'اطلاعات  ارسالی را بررسی نمایید';
                toast.error(errorMessage, {
                    position: "top-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored"
                });
            }
        } else {
            setLoading(false);
            toast.error('کد ملی وارد شده صحیح نمی باشد', {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
        }
    };

    return (
        <div className="padding-general navDistance">
            <Row>
                <Col className='mb-5 col-12'>
                    {!userData && (
                        <div className="alert alert-warning outline-2x">
                            <FontAwesomeIcon icon={faBell} className="mx-2" />
                            <span className="mr-2 text-body-2 text-hint-text-caution">
                                کاربر گرامی اطلاعات شما در سیستم کامل نمی باشد ، لطفا فرم زیر را با دقت تکمیل فرمایید
                            </span>
                        </div>
                    )}
                    <Form className='checkout-form' onSubmit={handleSubmit}>
                        <div className='p-4'>
                            <h3 className='mb-3'>اطلاعات شخصی</h3>
                            <Row className='mb-3'>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>نام</Form.Label>
                                        <Form.Control type="text" name="first_name" value={inputs.first_name || ""} onChange={handleChange} className="w-75" />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>نام‌خانوادگی</Form.Label>
                                        <Form.Control type="text" name="last_name" value={inputs.last_name || ""} onChange={handleChange} className="w-75"/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>جنسیت</Form.Label>
                                        <Form.Select value={inputs.gender || ""} name='gender' onChange={handleChange} className="w-75 pe-5">
                                            <option value="مرد">مرد</option>
                                            <option value="زن">زن</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className='mb-3'>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>کد ملی</Form.Label>
                                        <Form.Control type="number" name="code_melli" disabled={!!userData} value={inputs.code_melli || ""} onChange={handleChange} className="w-75"/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>شماره همراه</Form.Label>
                                        <Form.Control type="number" name="phone_number" disabled value={inputs.phone_number || ""} onChange={handleChange} className="w-75"/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>ایمیل</Form.Label>
                                        <Form.Control type="email" name="email" value={inputs.email || ""} onChange={handleChange} className="w-75"/>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>
                        <div className='mt-3 p-4'>
                            <h2 className='mb-3'>مشخصات ارسال</h2>
                            <Row className='mb-3'>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>کشور</Form.Label>
                                        <Form.Control type="text" name="country" disabled value={inputs.country || "ایران"} onChange={handleChange} className="w-75"/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>استان</Form.Label>
                                        <Form.Control type="text" name="state" value={inputs.state || ""} onChange={handleChange} className="w-75"/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className='mb-3'>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>شهر</Form.Label>
                                        <Form.Control type="text" name="city" value={inputs.city || ""} onChange={handleChange} className="w-75"/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>کد پستی</Form.Label>
                                        <Form.Control type="text" name="postal_code" value={inputs.postal_code || ""} onChange={handleChange} className="w-75"/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="ms-5 ps-3">
                                <Form.Label>آدرس</Form.Label>
                                <Form.Control as="textarea" rows={3} value={inputs.address || ""} name='address' onChange={handleChange} />
                            </Form.Group>
                        </div>
                        <div className='px-4 text-center'> {/* Center align button */}
                            <Button type="submit" className="mt-3 w-50">{loading ? 'صبور باشید ...' : 'ثبت اطلاعات'}</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default ProfileUpdate;
