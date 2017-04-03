import axios from 'axios';

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {

  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Do something with response data
    axios.defaults.headers.common['Auth'] = response.data.headers.token;
    return response;
  }, function (error) {

  });

export default axios;