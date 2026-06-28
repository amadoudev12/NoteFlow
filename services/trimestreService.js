import axiosClient from "./AxiosClient";

const trimestreService = {
    getTrimestres : () => axiosClient.get('trimestres/'),
    getTrimestresActive : ()=> axiosClient.get('trimestres/active'),
    postTrimestre : (data) => axiosClient.post('/trimestres/create',data),
    activeTrimestre : (id) => axiosClient.patch(`/trimestres/actif/${id}`),
    deleteTrimestre : (id) => axiosClient.delete(`/trimestres/delete/${id}`)
}
export default trimestreService