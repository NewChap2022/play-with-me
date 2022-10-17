import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Nav from './components/Nav';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ActivityDetail from './pages/ActivityDetail';
import Dashboard from './pages/Dashboard';
import NoMatch from './pages/NoMatch';
import NewPost from './pages/NewPost';
import EditActivity from './pages/EditActivity';

import { Provider } from 'react-redux';
import { store } from './utils/store';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
        <Router>
          <div>
            <Provider store={store}>
              <Nav />
              <Routes>
                <Route
                  path="/"
                  element={<Home />}
                />
                <Route
                  path="/activities/:id"
                  element={<ActivityDetail />}
                />
                <Route
                  path="/edit"
                  element={<EditActivity />}
                />
                <Route
                  path="/login"
                  element={<Login />}
                />
                <Route
                  path="/signup"
                  element={<SignUp />}
                />
                <Route
                  path="/dashboard"
                  element={<Dashboard />}
                />
                <Route
                  path="/newpost"
                  element={<NewPost />}
                />
                <Route
                  path="*"
                  element={<NoMatch />}
                />
              </Routes>
            </Provider>
          </div>
        </Router>
    </ApolloProvider>
  );
}

export default App;
