import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import PageRender from './PageRender';
import Register from './pages/register';
import Login from './pages/login';

function App() {
  return (
    <Router>
      <input type='checkbox' id='theme'/>
      <div className="App">
        <div className='main'> 
          <Routes>
              <Route exact path='/' Component={Login}/>
              <Route exact path='/:page' Component={PageRender} />
              <Route exact path='/:page/:id' Component={PageRender} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
