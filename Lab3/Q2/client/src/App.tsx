import { BrowserRouter, Routes, Route } from "react-router-dom";
import TransferPage from "./TransferPage";
import SuccessPage from "./SuccessPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TransferPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
}