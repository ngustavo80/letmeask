import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { AuthContextProvider } from './contexts/AuthContext'

import { Home } from './pages/Landing/Home'
import { NewRoom } from './pages/Landing/NewRoom'
import { Room } from './pages/RoomPages/Room'
import { AdminRoom } from './pages/RoomPages/AdminRoom'

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
      <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/rooms/new" component={NewRoom} />
          <Route path="/rooms/:id" component={Room} />
          
         <Route path="/admin/rooms/:id" component={AdminRoom} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  )
}

export default App