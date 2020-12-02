import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import Layout from './components/Layout';
import DashboardContainer from './container/DashboardContainer';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
function App() {
  return (
    <div>
      <Layout>
      <BrowserRouter>
        <Route path="/" component={DashboardContainer} />
      </BrowserRouter>
      </Layout>
    </div>
  );
}

export default App;
