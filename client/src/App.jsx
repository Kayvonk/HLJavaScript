import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import ModuleView from "./pages/ModuleView";
import LessonView from "./pages/LessonView";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/modules/:moduleId" element={<ModuleView />} />
        <Route path="/modules/:moduleId/:lessonId" element={<LessonView />} />
      </Route>
    </Routes>
  );
}

export default App;
