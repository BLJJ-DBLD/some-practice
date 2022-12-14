import React from 'react'
import {links} from './const'
import { Link } from 'react-router-dom'

function Home () {
  return (
    <>
      <header className="App-header">
        组件列表：
      </header>
      <ul>
        {links.map((route, index) => (
          <li key={index}>
            <Link to={route.path}>{route.name}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default Home
