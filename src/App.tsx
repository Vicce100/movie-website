import React from 'react';
import { UserAuth } from './contexts/UserAuth';
import Router from './routes/route';
import compose from './utils/compose';
import asHoc from './utils/asHoc';

const App = () => <Router />;

export default compose(asHoc(UserAuth, {}))(App);
