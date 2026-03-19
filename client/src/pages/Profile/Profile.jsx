import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './styles.css';
import { useDispatch, useSelector } from '../../store';
import { selectUser } from '../../selectors';
import { server } from '../../bff';
import { setUser } from '../../actions';

const emailSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required('Email обязателен')
    .email('Введите корректный email'),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required('Введите текущий пароль'),
  newPassword: yup
    .string()
    .required('Введите новый пароль')
    .min(6, 'Минимум 6 символов'),
  confirmNewPassword: yup
    .string()
    .required('Повторите новый пароль')
    .oneOf([yup.ref('newPassword')], 'Пароли не совпадают'),
});

export const Profile = () => {
  const navigate = useNavigate();
  const [userState, setUserState] = useState(null);
  const [emailMessage, setEmailMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const userFromStore = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userFromStore) {
      navigate('/login');
      return;
    }
    setUserState(userFromStore);
  }, [navigate, userFromStore]);

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    setValue: setEmailValue,
    formState: { errors: emailErrors, isSubmitting: isEmailSubmitting },
  } = useForm({
    resolver: yupResolver(emailSchema),
    mode: 'onBlur',
    defaultValues: { email: userState?.email || '' },
  });

  useEffect(() => {
    if (userState?.email) setEmailValue('email', userState.email);
  }, [setEmailValue, userState?.email]);

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm({
    resolver: yupResolver(passwordSchema),
    mode: 'onBlur',
  });

  const persistUser = nextUser => {
    sessionStorage.setItem('userData', JSON.stringify(nextUser));
    setUserState(nextUser);
    dispatch(setUser(nextUser));
  };

  const onChangeEmail = async ({ email }) => {
    setEmailMessage({ type: '', text: '' });
    if (!userState) return;

    try {
      const normalized = email.trim().toLowerCase();
      if (normalized === userState.email) {
        setEmailMessage({ type: 'success', text: 'Email не изменился' });
        return;
      }
      const { error, res } = await server.updateEmail({
        token: userState.token,
        email: normalized,
      });

      if (error) throw new Error(error);
      persistUser(res);
      setEmailMessage({ type: 'success', text: 'Email успешно обновлён' });
    } catch (e) {
      setEmailMessage({ type: 'error', text: e?.message || 'Ошибка' });
    }
  };

  const onChangePassword = async ({ currentPassword, newPassword }) => {
    setPasswordMessage({ type: '', text: '' });
    if (!userState) return;

    try {
      const { error, res } = await server.updatePassword({
        token: userState.token,
        currentPassword,
        newPassword,
      });
      if (error) throw new Error(error);

      persistUser(res);
      resetPassword();
      setPasswordMessage({ type: 'success', text: 'Пароль успешно обновлён' });
    } catch (e) {
      setPasswordMessage({ type: 'error', text: e?.message || 'Ошибка' });
    }
  };

  if (!userState) return null;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <h1 className="profile-title">Профиль</h1>
          <div className="profile-subtitle">
            Вы вошли как: <strong>{userState.email}</strong>
          </div>
        </div>

        <section className="profile-section">
          <h2 className="profile-section-title">Сменить email</h2>
          <form className="profile-form" onSubmit={handleSubmitEmail(onChangeEmail)}>
            <div className="profile-field">
              <label>Новый email</label>
              <input type="email" placeholder="Введите email" {...registerEmail('email')} />
              {emailErrors.email && (
                <span className="profile-error">{emailErrors.email.message}</span>
              )}
            </div>

            {emailMessage.text && (
              <div
                className={
                  emailMessage.type === 'error'
                    ? 'profile-server-error'
                    : 'profile-server-success'
                }
              >
                {emailMessage.text}
              </div>
            )}

            <button className="profile-btn" type="submit" disabled={isEmailSubmitting}>
              {isEmailSubmitting ? 'ЗАГРУЗКА...' : 'Сохранить email'}
            </button>
          </form>
        </section>

        <section className="profile-section">
          <h2 className="profile-section-title">Сменить пароль</h2>
          <form className="profile-form" onSubmit={handleSubmitPassword(onChangePassword)}>
            <div className="profile-field">
              <label>Текущий пароль</label>
              <input type="password" {...registerPassword('currentPassword')} />
              {passwordErrors.currentPassword && (
                <span className="profile-error">
                  {passwordErrors.currentPassword.message}
                </span>
              )}
            </div>

            <div className="profile-field">
              <label>Новый пароль</label>
              <input type="password" {...registerPassword('newPassword')} />
              {passwordErrors.newPassword && (
                <span className="profile-error">{passwordErrors.newPassword.message}</span>
              )}
            </div>

            <div className="profile-field">
              <label>Повторите новый пароль</label>
              <input type="password" {...registerPassword('confirmNewPassword')} />
              {passwordErrors.confirmNewPassword && (
                <span className="profile-error">
                  {passwordErrors.confirmNewPassword.message}
                </span>
              )}
            </div>

            {passwordMessage.text && (
              <div
                className={
                  passwordMessage.type === 'error'
                    ? 'profile-server-error'
                    : 'profile-server-success'
                }
              >
                {passwordMessage.text}
              </div>
            )}

            <button className="profile-btn" type="submit" disabled={isPasswordSubmitting}>
              {isPasswordSubmitting ? 'ЗАГРУЗКА...' : 'Сохранить пароль'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

