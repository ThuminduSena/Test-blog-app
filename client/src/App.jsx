import React from 'react'
import { BrowserRouter, Routes, Route }  from 'react-router-dom'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute'
import CreatePost from './pages/CreatePost'
import UpdatePost from './pages/UpdatePost'
import CreateAd from './pages/CreateAd'
import PostPage from './pages/PostPage'
import ScrollToTop from './components/ScrollToTop'
import Search from './pages/Search'
import UpdateAd from './pages/UpdateAd'



export default function App() {
  return (
    <BrowserRouter >
    <ScrollToTop />
      <Header />
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/search" element={<Search />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/post/:postSlug" element={<PostPage />} />

        <Route element = {<PrivateRoute/>}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element = {<OnlyAdminPrivateRoute/>}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
          <Route path="/create-ad" element={<CreateAd />} />
          <Route path="/update-ad/:adId" element={<UpdateAd />} />
        </Route>

      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
