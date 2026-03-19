import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import './registration.css';
import { server } from '../../bff';
import { useDispatch, useSelector } from '../../store';
import { setUser } from '../../actions';
import { selectUserRole } from '../../selectors';
import { ROLE } from '../../constants';
import { AuthField } from '../../components/auth/AuthField';
import { AuthPage } from '../../components/auth/AuthPage';

const registrationSchema = yup.object({
  name: yup.string().trim().required('Имя обязательно').min(2, 'Минимум 2 символа'),
  login: yup
    .string()
    .trim()
    .required('Заполните логин')
    .email('Введите корректный email'),
  password: yup.string().required('Пароль обязателен').min(6, 'Минимум 6 символов'),
  confirmPassword: yup
    .string()
    .required('Повторите пароль')
    .oneOf([yup.ref('password')], 'Пароли не совпадают'),
});

export const Registration = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [serverSuccess, setServerSuccess] = useState('');

  const dispatch = useDispatch();
  const roleId = useSelector(selectUserRole);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registrationSchema),
    mode: 'onBlur',
  });

  const onSubmit = async data => {
    setServerError('');
    setServerSuccess('');

    server
      .register({
        name: data.name,
        login: data.login,
        password: data.password,
      })
      .then(({ error, res }) => {
        if (error) {
          setServerError(`Ошибка запроса: ${error}`);
          return;
        }

        dispatch(setUser(res));
        sessionStorage.setItem('userData', JSON.stringify(res));
        setServerSuccess('Регистрация успешна');
        navigate('/profile');
      });
  };

  if (roleId !== ROLE.GUEST) {
    return <Navigate to="/" />;
  }

  return (
    <AuthPage
      pageClassName="auth-page"
      cardClassName="auth-card"
      titleClassName="auth-title"
      title="Регистрация"
      formClassName="auth-form"
      onSubmit={handleSubmit(onSubmit)}
      footer={
        <div className="auth-footer">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      }
    >
      <AuthField
        className="auth-field"
        label="Имя"
        error={errors.name ? { className: 'auth-error', message: errors.name.message } : null}
      >
        <input type="text" placeholder="Введите имя" {...register('name')} />
      </AuthField>

      <AuthField
        className="auth-field"
        label="Логин"
        error={errors.login ? { className: 'auth-error', message: errors.login.message } : null}
      >
        <input type="text" placeholder="Введите email" {...register('login')} />
      </AuthField>

      <AuthField
        className="auth-field"
        label="Пароль"
        error={
          errors.password
            ? { className: 'auth-error', message: errors.password.message }
            : null
        }
      >
        <input type="password" placeholder="Введите пароль" {...register('password')} />
      </AuthField>

      <AuthField
        className="auth-field"
        label="Повторите пароль"
        error={
          errors.confirmPassword
            ? { className: 'auth-error', message: errors.confirmPassword.message }
            : null
        }
      >
        <input
          type="password"
          placeholder="Повторите пароль"
          {...register('confirmPassword')}
        />
      </AuthField>

      {serverError && <div className="auth-server-error">{serverError}</div>}
      {serverSuccess && <div className="auth-server-success">{serverSuccess}</div>}

      <button type="submit" className="auth-btn" disabled={isSubmitting}>
        {isSubmitting ? 'ЗАГРУЗКА...' : 'Зарегистрироваться'}
      </button>
    </AuthPage>
  );
};

