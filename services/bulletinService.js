import axiosClient from "./AxiosClient";

const bulletinService = {
    getBulletinsByClasse : (id) => axiosClient.get(`/bulletin/${id}`,{
        responseType : "blob"
    }),
    genererBulletinClasse : (id)=> axiosClient.get(`/bulletin/${id}`)
}

export default bulletinService