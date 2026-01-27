import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = ({ setLoggedIn }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirm: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        employee_id: '',
        department: '',
        role: 'inspector' // Default to inspector
    });
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Role choices that match your backend
    const roleChoices = [
        { value: 'inspector', label: 'Quality Inspector' },
        { value: 'supervisor', label: 'Supervisor' },
        { value: 'admin', label: 'Administrator' },
        { value: 'analyst', label: 'Quality Analyst' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear specific field error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Required field validations
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        
        if (formData.password !== formData.password_confirm) {
            newErrors.password_confirm = 'Passwords do not match';
        }
        
        if (!formData.first_name.trim()) {
            newErrors.first_name = 'First name is required';
        }
        
        if (!formData.last_name.trim()) {
            newErrors.last_name = 'Last name is required';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        
        setLoading(true);
        setErrors({});
        
        try {
            const response = await fetch('http://localhost:8000/api/auth/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Store tokens in localStorage (using consistent keys)
                if (data.tokens) {
                    localStorage.setItem('accessToken', data.tokens.access);
                    localStorage.setItem('refreshToken', data.tokens.refresh);
                } else if (data.access) {
                    localStorage.setItem('accessToken', data.access);
                    localStorage.setItem('refreshToken', data.refresh);
                }
                
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
                
                // Update logged-in state
                if (setLoggedIn) {
                    setLoggedIn(true);
                }
                
                alert('Registration successful!');
                
                // Redirect to dashboard using navigate
                navigate('/dashboard');
                
            } else {
                // Handle validation errors from backend
                if (data.details) {
                    setErrors(data.details);
                } else if (data.error) {
                    setErrors({ general: data.error });
                } else {
                    setErrors({ general: 'Registration failed. Please try again.' });
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrors({ 
                general: 'Network error. Please check your connection and try again.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card" style={{ maxWidth: '600px' }}>
                <h2 className="login-title">Create Account</h2>
                <p className="login-subtitle">Join our Quality Monitoring System</p>
                
                {errors.general && (
                    <div className="error-message">
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    {/* Username */}
                    <div className="form-group">
                        <label htmlFor="username">Username *</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className={errors.username ? 'error' : ''}
                            placeholder="Enter username"
                        />
                        {errors.username && (
                            <span className="error-text">{errors.username}</span>
                        )}
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={errors.email ? 'error' : ''}
                            placeholder="Enter email address"
                        />
                        {errors.email && (
                            <span className="error-text">{errors.email}</span>
                        )}
                    </div>

                    {/* First Name & Last Name */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="first_name">First Name *</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                className={errors.first_name ? 'error' : ''}
                                placeholder="First name"
                            />
                            {errors.first_name && (
                                <span className="error-text">{errors.first_name}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="last_name">Last Name *</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                                className={errors.last_name ? 'error' : ''}
                                placeholder="Last name"
                            />
                            {errors.last_name && (
                                <span className="error-text">{errors.last_name}</span>
                            )}
                        </div>
                    </div>

                    {/* Role */}
                    <div className="form-group">
                        <label htmlFor="role">Role *</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className={errors.role ? 'error' : ''}
                        >
                            {roleChoices.map(role => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                        {errors.role && (
                            <span className="error-text">{errors.role}</span>
                        )}
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label htmlFor="password">Password *</label>
                        <div className="password-input">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={errors.password ? 'error' : ''}
                                placeholder="Enter password"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="error-text">{errors.password}</span>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group">
                        <label htmlFor="password_confirm">Confirm Password *</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password_confirm"
                            name="password_confirm"
                            value={formData.password_confirm}
                            onChange={handleInputChange}
                            className={errors.password_confirm ? 'error' : ''}
                            placeholder="Confirm password"
                        />
                        {errors.password_confirm && (
                            <span className="error-text">{errors.password_confirm}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        Already have an account? 
                        <Link to="/login" className="signup-link"> Log in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;