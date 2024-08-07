import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api'; // Use the correct backend port

export const getSearches = () => axios.get(`${API_BASE_URL}/searches`);
export const createSearch = (data: any) => axios.post(`${API_BASE_URL}/searches`, data);
export const updateSearch = (id: number, data: any) => axios.put(`${API_BASE_URL}/searches/${id}`, data);
export const deleteSearch = (id: number) => axios.delete(`${API_BASE_URL}/searches/${id}`);
export const getSearchResults = (searchId: number) => axios.get(`${API_BASE_URL}/searches/${searchId}/results`);
