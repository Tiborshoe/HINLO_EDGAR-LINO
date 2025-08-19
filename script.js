class LoginForm {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.submitBtn = this.form.querySelector('.submit-btn');
        this.togglePasswordBtn = document.querySelector('.toggle-password');
        this.statusMessage = document.getElementById('form-status');
        
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.validateForm();
    }

    attachEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        this.emailInput.addEventListener('input', () => this.validateEmail());
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        
        this.passwordInput.addEventListener('input', () => this.validatePassword());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        
        // Form validation check
        this.form.addEventListener('input', () => this.validateForm());
        
        // Password toggle
        this.togglePasswordBtn.addEventListener('click', () => this.togglePassword());
        
        // Accessibility: Enter key on toggle button
        this.togglePasswordBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.togglePassword();
            }
        });
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        const errorElement = document.getElementById('email-error');
        
        if (!email) {
            this.showFieldError(errorElement, 'Email address is required');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showFieldError(errorElement, 'Please enter a valid email address');
            return false;
        }
        
        this.clearFieldError(errorElement);
        return true;
    }

    validatePassword() {
        const password = this.passwordInput.value;
        const errorElement = document.getElementById('password-error');
        
        if (!password) {
            this.showFieldError(errorElement, 'Password is required');
            return false;
        }
        
        if (password.length < 8) {
            this.showFieldError(errorElement, 'Password must be at least 8 characters long');
            return false;
        }
        
        this.clearFieldError(errorElement);
        return true;
    }

    validateForm() {
        const isEmailValid = this.emailInput.value.trim() && this.validateEmail();
        const isPasswordValid = this.passwordInput.value && this.validatePassword();
        
        this.submitBtn.disabled = !(isEmailValid && isPasswordValid);
    }

    showFieldError(errorElement, message) {
        errorElement.textContent = message;
        errorElement.parentElement.querySelector('input').setAttribute('aria-invalid', 'true');
    }

    clearFieldError(errorElement) {
        errorElement.textContent = '';
        errorElement.parentElement.querySelector('input').removeAttribute('aria-invalid');
    }

    togglePassword() {
        const type = this.passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        this.passwordInput.setAttribute('type', type);
        
        const eyeIcon = this.togglePasswordBtn.querySelector('.eye-icon');
        eyeIcon.textContent = type === 'password' ? '👁️' : '🙈';
        
        this.togglePasswordBtn.setAttribute('aria-label', 
            type === 'password' ? 'Show password' : 'Hide password'
        );
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Final validation
        if (!this.validateEmail() || !this.validatePassword()) {
            this.showStatusMessage('Please fix the errors above', 'error');
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Simulate API call
            const result = await this.simulateLogin();
            
            if (result.success) {
                this.showStatusMessage('Login successful! Redirecting...', 'success');
                // Simulate redirect after delay
                setTimeout(() => {
                    alert('In a real app, you would be redirected to the dashboard');
                }, 1500);
            } else {
                this.showStatusMessage(result.message, 'error');
            }
        } catch (error) {
            this.showStatusMessage('An unexpected error occurred. Please try again.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    async simulateLogin() {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;
        
        // Sample validation (in real app, this would be server-side)
        const validCredentials = {
            'demo@example.com': 'password123',
            'user@test.com': 'mypassword'
        };
        
        if (validCredentials[email] === password) {
            return { success: true };
        } else {
            return { 
                success: false, 
                message: 'Invalid email or password. Try user@test.com / mypassword' 
            };
        }
    }

    setLoadingState(loading) {
        this.submitBtn.classList.toggle('loading', loading);
        this.submitBtn.disabled = loading;
        
        if (loading) {
            this.submitBtn.setAttribute('aria-label', 'Signing in, please wait');
        } else {
            this.submitBtn.removeAttribute('aria-label');
        }
    }

    showStatusMessage(message, type) {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-message ${type}`;
        this.statusMessage.style.display = 'block';
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                this.statusMessage.style.display = 'none';
            }, 5000);
        }
    }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginForm();
});

// Add keyboard navigation enhancements
document.addEventListener('keydown', (e) => {
    // ESC to clear error messages
    if (e.key === 'Escape') {
        const statusMessage = document.getElementById('form-status');
        if (statusMessage.style.display === 'block') {
            statusMessage.style.display = 'none';
        }
    }
});