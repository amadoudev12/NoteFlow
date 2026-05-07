import { data } from "react-router-dom";
import axiosClient from "./AxiosClient";

const matiereService = {
    getMatieres : ()=> axiosClient.get('/matieres'),
    postMatier : (data)=> axiosClient.post('/matieres/add', data),
    modMatiere : (id, data)=> axiosClient.put(`/matieres/update/${id}`, data),
    delMatiere : (id)=> axiosClient.delete(`/matieres/delete/${id}`)
}

export default matiereService