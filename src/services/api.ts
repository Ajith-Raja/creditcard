import { API_BASE_URL } from '../config';

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(error.message || `API Error: ${response.statusText}`);
    }
    if (response.status === 204) return null;
    return response.json();
};

export const api = {
    banks: {
        getAll: () => fetch(`${API_BASE_URL}/banks`).then(handleResponse),
        getById: (id: number) => fetch(`${API_BASE_URL}/banks/${id}`).then(handleResponse),
        create: (data: any) => fetch(`${API_BASE_URL}/banks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(handleResponse),
        update: (id: number, data: any) => fetch(`${API_BASE_URL}/banks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(handleResponse),
        delete: (id: number) => fetch(`${API_BASE_URL}/banks/${id}`, { method: 'DELETE' }).then(handleResponse),
    },
    cards: {
        getAll: (params?: { bankId?: number; cardTypeId?: number; isActive?: boolean }) => {
            const query = new URLSearchParams();
            if (params?.bankId) query.append('bankId', params.bankId.toString());
            if (params?.cardTypeId) query.append('cardTypeId', params.cardTypeId.toString());
            if (params?.isActive !== undefined) query.append('isActive', params.isActive.toString());
            return fetch(`${API_BASE_URL}/credit-cards?${query.toString()}`).then(handleResponse);
        },
        getById: (id: number) => fetch(`${API_BASE_URL}/credit-cards/${id}`).then(handleResponse),
        create: (data: any) => fetch(`${API_BASE_URL}/credit-cards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(handleResponse),
        update: (id: number, data: any) => fetch(`${API_BASE_URL}/credit-cards/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(handleResponse),
        delete: (id: number) => fetch(`${API_BASE_URL}/credit-cards/${id}`, { method: 'DELETE' }).then(handleResponse),
    },
    types: {
        getAll: () => fetch(`${API_BASE_URL}/card-types`).then(handleResponse),
        create: (data: any) => fetch(`${API_BASE_URL}/card-types`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(handleResponse),
        delete: (id: number) => fetch(`${API_BASE_URL}/card-types/${id}`, { method: 'DELETE' }).then(handleResponse),
    },
    tags: {
        getAll: () => fetch(`${API_BASE_URL}/card-tags`).then(handleResponse),
        create: (data: any) => fetch(`${API_BASE_URL}/card-tags`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(handleResponse),
        delete: (id: number) => fetch(`${API_BASE_URL}/card-tags/${id}`, { method: 'DELETE' }).then(handleResponse),
    }
    ,
    rewardTypes: {
        getAll: () => fetch(`${API_BASE_URL}/rewardtypes`).then(handleResponse),
        create: (data: any) => fetch(`${API_BASE_URL}/rewardtypes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(handleResponse),
        update: (id: string, data: any) => fetch(`${API_BASE_URL}/rewardtypes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(handleResponse),
        delete: (id: string) => fetch(`${API_BASE_URL}/rewardtypes/${id}`, { method: 'DELETE' }).then(handleResponse),
    }
    ,
    upload: {
        uploadCardLogo: (file: File) => {
            const fd = new FormData();
            fd.append('file', file);
            return fetch(`${API_BASE_URL}/credit-cards/upload-logo`, {
                method: 'POST',
                body: fd
            }).then(handleResponse);
        }
    }
};

// add bank logo upload helper alias
(api as any).upload.uploadBankLogo = (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return fetch(`${API_BASE_URL}/banks/upload-logo`, { method: 'POST', body: fd }).then(handleResponse);
};
