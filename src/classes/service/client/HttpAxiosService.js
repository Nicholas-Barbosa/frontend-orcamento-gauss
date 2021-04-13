import axios from "axios";
//import AuthenSerivce from "../AuthenService"

export default  axios.create({
  baseURL: "http://192.168.0.246:8091/rest/",
  timeout: 15000,
  headers: {
    "Content-type": "application/json",
  
  }
});
