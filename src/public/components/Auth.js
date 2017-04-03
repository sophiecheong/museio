import axios from 'axios';

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    console.log("config");
    return config;
  }, function (error) {
    // Do something with request error
  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Do something with response data

    console.log(response);
    return response;
  }, function (error) {
    // Do something with response error
  });

export default axios;