import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'
import AppNavbar from '../../components/AppNavbar'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="home">
      <AppNavbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-left">
          <h1 className="hero-title">
            Get Your <span className="blue">Dream Job</span> Today!
          </h1>

          <p className="hero-desc">
            Our Job Portal is designed to make job searching simple, fast, and effective.
            Whether you are a fresher or an experienced professional, you can discover
            thousands of job opportunities tailored to your skills and interests.

            Recruiters can easily post jobs, manage applications, and find the right
            candidates, while job seekers can apply, track applications, and update their
            profiles effortlessly.
          </p>

          <button
            className="hero-btn"
            onClick={() => navigate('/register')}
          >
            Apply Now
          </button>
        </div>

        <div className="hero-right">
          <img src="/logo2.png" alt="hero" className="hero-img" />
        </div>
      </section>

    </div>
  )
}

export default Home
