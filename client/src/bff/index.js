import { ROLE } from '../constants';

const AUTH_API_URL = 'http://localhost:5000/api';

const fetchWithTimeout = (url, options, timeout = 5000) => {
	return Promise.race([
		fetch(url, options),
		new Promise((_, reject) => setTimeout(() => reject(new Error('Сервер не отвечает (таймаут)')), timeout)),
	]);
};

const parseJwt = (token) => {
	try {
		const part = String(token ?? '').split('.')[1];
		if (!part) return null;
		const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
		const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
		return JSON.parse(atob(padded));
	} catch {
		return null;
	}
};

const roleToRoleId = (role) => {
	if (role === 'ADMIN') return ROLE.ADMIN;
	if (role === 'USER') return ROLE.USER;
	return ROLE.USER;
};

const userFromToken = (token) => {
	const payload = parseJwt(token);
	const email = payload?.email ?? null;
	const role = payload?.role ?? 'USER';
	return {
		token,
		email,
		role,
		roleId: roleToRoleId(role),
	};
};

const authtorize = async (login, password) => {
	try {
		const normalizedLogin = String(login ?? '')
			.trim()
			.toLowerCase();

		const res = await fetchWithTimeout(`${AUTH_API_URL}/user/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: normalizedLogin,
				password: String(password ?? ''),
			}),
		});

		if (!res.ok) {
			return { error: 'Неверный логин или пароль', res: null };
		}

		const data = await res.json();
		const token = data?.token;
		if (!token) return { error: 'Сервер не вернул токен', res: null };

		return {
			error: null,
			res: userFromToken(token),
		};
	} catch (e) {
		return { error: e?.message || 'Ошибка запроса', res: null };
	}
};

const register = async ({ login, password }) => {
	try {
		const normalizedLogin = String(login ?? '')
			.trim()
			.toLowerCase();

		const createRes = await fetchWithTimeout(`${AUTH_API_URL}/user/registration`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: normalizedLogin,
				password: String(password ?? ''),
				role: 'USER',
			}),
		});

		if (!createRes.ok) {
			return { error: 'Не удалось зарегистрироваться', res: null };
		}

		const created = await createRes.json();
		const token = created?.token;
		if (!token) return { error: 'Сервер не вернул токен', res: null };

		return {
			error: null,
			res: userFromToken(token),
		};
	} catch (e) {
		return { error: e?.message || 'Ошибка регистрации', res: null };
	}
};

const updateEmail = async ({ token, email }) => {
	try {
		const normalized = String(email ?? '')
			.trim()
			.toLowerCase();
		const res = await fetchWithTimeout(`${AUTH_API_URL}/user/email`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ email: normalized }),
		});

		if (!res.ok) {
			const text = await res.text().catch(() => '');
			return { error: text || 'Не удалось обновить email', res: null };
		}

		const data = await res.json();
		if (!data?.token) return { error: 'Сервер не вернул токен', res: null };
		return { error: null, res: userFromToken(data.token) };
	} catch (e) {
		return { error: e?.message || 'Ошибка запроса', res: null };
	}
};

const updatePassword = async ({ token, currentPassword, newPassword }) => {
	try {
		const res = await fetchWithTimeout(`${AUTH_API_URL}/user/password`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ currentPassword, newPassword }),
		});

		if (!res.ok) {
			const text = await res.text().catch(() => '');
			return { error: text || 'Не удалось обновить пароль', res: null };
		}

		const data = await res.json();
		if (!data?.token) return { error: 'Сервер не вернул токен', res: null };
		return { error: null, res: userFromToken(data.token) };
	} catch (e) {
		return { error: e?.message || 'Ошибка запроса', res: null };
	}
};

export const server = {
	authtorize,
	authorize: authtorize,
	register,
	updateEmail,
	updatePassword,
};
