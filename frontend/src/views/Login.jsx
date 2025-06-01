import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import workbuddyLogo from '../assets/workbuddy-logo.png';

// Estilos en línea para evitar problemas con Tailwind
const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f3f2f'
  },
  formCard: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
  },
  header: {
    backgroundColor: '#0f3f2f',
    padding: '24px',
    textAlign: 'center',
  },
  logoContainer: {
    width: '80px',
    height: '80px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px'
  },
  logo: {
    height: '50px',
    width: 'auto'
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '4px'
  },
  subtitle: {
    color: '#7cc9b0',
    fontSize: '14px'
  },
  formContainer: {
    padding: '32px'
  },
  fieldGroup: {
    marginBottom: '24px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    backgroundColor: '#0f3f2f',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '10px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '8px'
  },
  flexRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: '8px'
  },
  link: {
    color: '#1a5a45',
    textDecoration: 'none',
    fontSize: '14px',
  },
  error: {
    color: '#dc2626',
    fontSize: '12px',
    marginTop: '5px'
  },
  footer: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '12px',
    marginTop: '24px'
  }
};

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      toast.success('¡Inicio de sesión exitoso!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <img 
              src={workbuddyLogo} 
              alt="WorkBuddy Logo" 
              style={styles.logo}
            />
          </div>
          <h2 style={styles.title}>Iniciar Sesión</h2>
          <p style={styles.subtitle}>Accede a tu cuenta de WorkBuddy</p>
        </div>
        
        {/* Form */}
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={styles.fieldGroup}>
              <label htmlFor="email" style={styles.label}>Correo Electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="correo@ejemplo.com"
                style={styles.input}
                {...register('email', {
                  required: 'El correo electrónico es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Formato de correo electrónico inválido',
                  },
                })}
              />
              {errors.email && (
                <p style={styles.error}>{errors.email.message}</p>
              )}
            </div>
            
            <div style={styles.fieldGroup}>
              <label htmlFor="password" style={styles.label}>Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                style={styles.input}
                {...register('password', {
                  required: 'La contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres',
                  },
                })}
              />
              {errors.password && (
                <p style={styles.error}>{errors.password.message}</p>
              )}
            </div>

            <div style={styles.flexRow}>
              <div style={styles.checkboxGroup}>
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  style={styles.checkbox}
                />
                <label htmlFor="remember-me" style={{fontSize: '14px', color: '#333'}}>
                  Recordarme
                </label>
              </div>

              <a href="#" style={styles.link}>¿Olvidaste tu contraseña?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={styles.button}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
          
          <div style={styles.footer}>
            © {new Date().getFullYear()} WorkBuddy | Todos los derechos reservados
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
