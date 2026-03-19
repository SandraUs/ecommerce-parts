import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './login.css';
import { server } from '../../bff';
import { useResetForm } from '../../hooks';
import { useDispatch, useSelector } from '../../store';
import { setUser } from '../../actions';
import { selectUserRole } from '../../selectors';
import { ROLE } from '../../constants';
import { AuthField } from '../../components/auth/AuthField';
import { AuthPage } from '../../components/auth/AuthPage';

const loginSchema = yup.object({
  login: yup
    .string()
    .trim()
    .required('Заполните логин')
    .email('Введите корректный email'),
  password: yup.string().required('Пароль обязателен').min(6, 'Минимум 6 символов'),
});

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState(null);

  const dispatch = useDispatch();
  const roleId = useSelector(selectUserRole);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  });

  useResetForm(reset, { login: '', password: '' });

  const onSubmit = async data => {
    server.authtorize(data.login, data.password).then(({ error, res }) => {
      if (error) {
        setServerError(`Ошибка запроса: ${error}`);
        return;
      }

      dispatch(setUser(res));
      sessionStorage.setItem('userData', JSON.stringify(res));
    });
  };

  const formError = errors?.login?.message || errors?.password?.message;
  const errorMessage = formError || serverError;

  if (roleId !== ROLE.GUEST) {
    return <Navigate to="/" />;
  }

  return (
    <AuthPage
      pageClassName="login-page"
      cardClassName="login-card"
      titleClassName="login-title"
      title="ВХОД"
      formClassName="login-form"
      onSubmit={handleSubmit(onSubmit)}
      footer={
        <div className="login-footer">
          <span>У вас еще нет аккаунта?</span>
          <Link to="/registration">Зарегистрироваться</Link>
        </div>
      }
    >
      <AuthField
        className="login-field"
        label="Логин"
        error={errors.login ? { className: 'login-error', message: errors.login.message } : null}
      >
        <input
          type="text"
          placeholder="Введите email"
          {...register('login', {
            onChange: () => setServerError(null),
          })}
        />
      </AuthField>

      <AuthField
        className="login-field"
        label="Пароль"
        error={
          errors.password
            ? { className: 'login-error', message: errors.password.message }
            : null
        }
      >
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Введите ваш пароль"
            {...register('password', {
              onChange: () => setServerError(null),
            })}
          />
          <span
            className="password-eye"
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: 'pointer' }}
          >
            {showPassword ? '🙈' : '👁'}
          </span>
        </div>
      </AuthField>

      {errorMessage && <div className="login-server-error">{errorMessage}</div>}

      <button type="submit" className="login-button" disabled={!!formError || isSubmitting}>
        {isSubmitting ? 'ЗАГРУЗКА...' : 'ВОЙТИ'}
      </button>
    </AuthPage>
  );
};

