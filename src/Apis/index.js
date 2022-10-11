import axios from "./../utils/axios"
import uri from '../utils/uri';
import Instance from "./instances";
const USERNAME = "user";
const PASSWORD = "password";

export const getInstance = async (id) => {
    const path = uri`instances/${id}`
    return axios.get(`${path}`, {
        headers: {'Accept': 'application/json'},
        auth: {
            username: USERNAME,
            password: PASSWORD
        },
        transformResponse(data) {
          if (!data) {
            return data;
          }
          console.log(data);
          const instance = JSON.parse(data);
        //   return instance;
        //   console.log(instance)
          return new Instance(instance);
        }
      });
}