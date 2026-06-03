import axiosClient from "./AxiosClient";

const userService = {
    loginUser: (data) => axiosClient.post('user/login', data),
    updateUser: (formData) => axiosClient.put('/user/premiere-connexion', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
};

export default userService