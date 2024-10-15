import './App.css';
import DynamicForm from './component/DynemicForm';
import formSchema from './form.json';

function App() {
  return (
    <div className="App">
      {/* <h1 className='font-bold text-3xl'>Hello</h1> */}
      <DynamicForm formSchema={formSchema}/>
    </div>
  );
}

export default App;
