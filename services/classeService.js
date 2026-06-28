import axiosClient from "./AxiosClient";
const classeService = {
    getListApi : (id)=> axiosClient.get(`classe/liste-classe/${id}`),
    classeInfo : (id)=> axiosClient.get(`classe/${id}`),
    getAllClasse : () => axiosClient.get(`classe/etablissement/classe/`),
    getClasseMatiere : (id) => axiosClient.get(`classe/classe-matiere/${id}`),
    postClasses : (data)=> axiosClient.post('/classe/create',data),
    modClasse:(id, data)=> axiosClient.put(`/classe/update/${id}`, data),
    delClasse:(id)=> axiosClient.delete(`/classe/delete/${id}`),
    statClasse:(id,data)=> axiosClient.get(`classe/stat-classe/${id}`,{
        params : data
    }),
    moyenneMaptieres:(id,data)=> axiosClient.get(`classe/moyenne/matiere/${id}`,{
        params : data
    }),
    repartitionNotes:(id,data)=> axiosClient.get(`classe/repartition/notes/${id}`,{
        params : data
    }),
}

export default classeService