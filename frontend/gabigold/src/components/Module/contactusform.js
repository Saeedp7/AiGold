import React, { useState } from 'react';

function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would handle form submission, like sending data to a server
        console.log(formData);
    };

    return (
        <div className="container py-2 mb-2">
            <form onSubmit={handleSubmit} className="form-group border-0">
                <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control border-0 border-bottom mb-3 w-75"
                    placeholder="نام"
                />
                <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control border-0 border-bottom mb-3 w-75"
                    placeholder="ایمیل"
                />
                <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-control border-0 border-bottom mb-3 w-75"
                    placeholder="متن پیام"
                    rows="4"
                />
                <button type="submit" className="btn btn-primary mt-2">ارسال</button>
            </form>
        </div>
    );
}

export default ContactForm;
