import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import ReactDOM from 'react-dom';
import { Home } from "./pages/Home";
import "./sass/index.scss";

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path={process.env.PUBLIC_URL} element={<Home />} />
        </Routes>
    </BrowserRouter>,
    document.getElementById('root')
);

