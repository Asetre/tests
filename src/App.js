import React, { Component } from 'react';
import firebase from 'firebase'
import firebaseui from 'firebaseui'
import axios from 'axios'
import './App.css';

const serverUrl = 'http://localhost:5000/scps-jarvis/us-central1/api1/'

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCXLvNHTJqdnzGr4iDcd3ITDfUO-U1eXoc",
  authDomain: "scps-jarvis.firebaseapp.com",
  databaseURL: "https://scps-jarvis.firebaseio.com",
  projectId: "scps-jarvis",
  storageBucket: "scps-jarvis.appspot.com",
  messagingSenderId: "775372784899"
};

firebase.initializeApp(config);

const ui = new firebaseui.auth.AuthUI(firebase.auth());


class App extends Component {
  constructor() {
    super()

    this.state = {
      user: null
    }

    this.handleLogin = this.handleLogin.bind(this)
  }

  componentDidMount() {
    this.authListener = firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log(user)
        firebase.auth().currentUser.getIdToken()
        .then(function (idToken) {
          let test = `${serverUrl}/user/signin`
          axios.get(test, {
            headers: {
              'Authorization': `${idToken}`,
              'X-Email': user.email,
              'X-DisplayName': user.displayName
            }
          })
          .then((res) => {
            console.log(res.data)
          })
        }).catch(function (error) {
          // Handle error
        });
        //axios.get('/login', )
      }
    });
  }

  handleLogin() {
    ui.start('#firebaseui-auth-container', {
      signInOptions: [
        // List of OAuth providers supported.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      // Other config options...
    });
  }

  render() {
    return (
      <div className="App">
        <div className="auth-container">
          <button onClick={this.handleLogin}>Login</button>
          <div id="firebaseui-auth-container">
          </div>
        </div>
      </div>
    );
  }
}

export default App;
