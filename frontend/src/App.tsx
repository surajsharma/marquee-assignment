import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AutoComplete from "./Components/AutoComplete";
import Table from "./Components/Table";

export default function App() {
    return (
        <Router>
            <div className="d-flex flex-column justify-content-md-center align-items-center vh-100">
                <Routes>
                    <Route path="/" element={<AutoComplete />} />
                    <Route path="/table" element={<Table />} />
                </Routes>
            </div>
        </Router>
    );
}
