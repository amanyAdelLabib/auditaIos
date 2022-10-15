import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
//import config from '../../config/config';

export default class UserApi {
  constructor() {
    this.apiUrl = 'https://audita.app';
  }

  init(urlInit) {
    console.log('url  >>>>>>>>' + urlInit);
    this.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    this.client = axios.create({
      baseUrl: urlInit,
      //timeout:31000
      headers: this.headers,
    });
    return this.client;
  }

  initMulti(urlInit) {
    console.log('url  >>>>>>>>' + urlInit);
    this.headers = {'Content-Type': 'multipart/form-data'};
    this.client = axios.create({
      baseUrl: urlInit,
      //timeout:31000
      headers: this.headers,
    });
    return this.client;
  }

  /*********************** login function  **************************************************/
  login(data) {
    // console.log('in login return service');
    // console.log('date login');
    // console.log(data);
    return this.init()
      .post(`${this.apiUrl}/api/mapping`, data)
      .then((res) => {
        // console.log('in then login class');
        console.log(res);

        return res;
      })
      .catch((err) => {
        console.log('in login class catch err');
        console.log(err);

        console.log(err.response.data);
        return err.response;
      });
  }

  /*********************** store in asynStorage function  **************************************************/

  storeData = async (brand, branch, pass) => {
    this.USER = {
      brand_name: brand,
      branch_name: branch,
      password: pass,
    };
    try {
      await AsyncStorage.setItem('USER', JSON.stringify(this.USER));
      console.log('success storage');
      //   this.props.navigation.navigate('Home');
    } catch (e) {
      console.log('err');
      console.log(e);
    }
  };
  /*********************** get questions function  **************************************************/
  GetQuestions(data) {
    // console.log('in c;ass get question test');
    // console.log(data);
    // console.log(data.url);
    return (
      this.init(data.url)
        .post(`${data.url}/getQuestions`, data)
        //return this.init().post("/users/login",data).

        .then((res) => {
          // console.log('in then get question');
          return res.data;
        })
        .catch((err) => {
          console.log('in get question');
          console.log(err);
          return err;
        })
    );
  }

  /*********************** Post Survey  **************************************************/
  PostSurvey(data) {
    return this.init(data.url)
      .post(`${data.url}/addSurvey`, data)
      .then((res) => {
        // console.log('in then get question');
        return res;
      })
      .catch((err) => {
        // console.log('in get question');
        console.log(err);
        return err.response;
      });
  }
  /*********************** get comment function  **************************************************/
  GetComment(data) {
    console.log('in get comment');
    return this.init(data.url)
      .post(`${data.url}/getCommenttxt`, data)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log('in get comment');
        console.log(err);
        return err;
      });
  }
  /*********************** get Projects function  **************************************************/
  GetProjects(data) {
    console.log('in get projects');
    return this.init(data.url)
      .get(`${data.url}/projects?user_id=${data.id}`, data)
      .then((res) => {
        console.log('response projects');
        console.log(res);

        return res;
      })
      .catch((err) => {
        console.log('in get projects err');
        console.log(err);
        return err;
      });
  }
  /*********************** get areas function  **************************************************/
  GetAreas(data) {
    console.log('in get areas');
    console.log(data);

    return this.init(data.url)
      .get(`${data.url}/areas/${data.id}`, data)
      .then((res) => {
        console.log(data);
        console.log(data);

        return res;
      })
      .catch((err) => {
        console.log('in get areas');
        console.log(err);
        return err;
      });
  }
  /*********************** get Projects function  **************************************************/
  GetAllUserData(data) {
    console.log('in get all user data');
    console.log(data)
    return this.init(data.url)
      .get(`${data.url}/getFullData?user_id=${data.id}`)
      .then((res) => {
        console.log('response all user data');
        console.log(res);

        return res;
      })
      .catch((err) => {
        console.log('in get all user data err');
        console.log(err);
        return err;
      });
  }
}
