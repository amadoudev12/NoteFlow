import axiosClient from "./AxiosClient";
const classeService = {
    getListApi : (id)=> axiosClient.get(`classe/liste-classe/${id}`),
    getAllClasse : () => axiosClient.get(`classe/etablissement/classe/`),
    getClasseMatiere : (id) => axiosClient.get(`classe/classe-matiere/${id}`),
    postClasses : (data)=> axiosClient.post('/classe/create',data),
    modClasse:(id, data)=> axiosClient.put(`/classe/update/${id}`, data),
    delClasse:(id)=> axiosClient.delete(`/classe/delete/${id}`)
}

export default classeService