import "./App.css";
import DynamicForm from "./component/DynemicForm";
import formSchema from "./form.json";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div>
      <DynamicForm formSchema={formSchema} />
      <ToastContainer />
    </div>
  );
}

export default App;
