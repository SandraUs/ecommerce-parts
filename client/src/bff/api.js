export const API_BASE = 'http://localhost:5000/api';

export const API_ORIGIN = API_BASE.replace(/\/api$/, '');

export const withAuth = (token, init = {}) => {
	const headers = new Headers(init.headers ?? {});
	if (token) headers.set('Authorization', `Bearer ${token}`);
	return { ...init, headers };
};

export const getImageUrl = (imagePath) => {
	if (!imagePath) return '';
	if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
		return imagePath;
	}
	return `${API_ORIGIN}${imagePath}`;
};
