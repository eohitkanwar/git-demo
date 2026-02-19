// src/pages/LoginPage.js

import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import "../styles/auth.css";



const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();



  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };



  const handleSubmit = async (e) => {

    e.preventDefault();



    if (!formData.email || !formData.password) {

      toast.error("Please enter both email and password", {

        position: "top-right",

        autoClose: 5000,

        hideProgressBar: false,

        closeOnClick: true,

        pauseOnHover: true,

        draggable: true,

      });

      return;

    }



    setLoading(true);

    try {

      const { success, message } = await login(

        formData.email,

        formData.password

      );



      if (success) {

        // Navigate first, then show the success message on the dashboard

        navigate("/dashboard", {

          state: { loginSuccess: true },

          replace: true

        });

      } else {

        toast.error(message || "Login failed. Please check your credentials.", {

          position: "top-right",

          autoClose: 5000,

          hideProgressBar: false,

          closeOnClick: true,

          pauseOnHover: true,

          draggable: true,

        });

      }

    } catch (error) {

      toast.error("An error occurred. Please try again.", {

        position: "top-right",

        autoClose: 5000,

        hideProgressBar: false,

        closeOnClick: true,

        pauseOnHover: true,

        draggable: true,

      });

    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="auth-container">

      <ToastContainer

        position="top-right"

        autoClose={5000}

        hideProgressBar={false}

        newestOnTop={false}

        closeOnClick

        rtl={false}

        pauseOnFocusLoss

        draggable

        pauseOnHover

      />

      <div className="auth-card">

        <div className="auth-logo">
          {/* Add your logo here */}
          <h1 className="auth-title">Admin Panel Login</h1>
          <p className="auth-subtitle">Enter your admin credentials to access the dashboard</p>
        </div>



        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="form-group">

            <label htmlFor="email">Email address</label>

            <input

              id="email"

              name="email"

              type="email"

              autoComplete="email"

              required

              placeholder="Enter your email"

              value={formData.email}

              onChange={handleChange}

            />

          </div>



          <div className="form-group">

            <div className="flex justify-between items-center">

              <label htmlFor="password">Password</label>

            </div>

            <input

              id="password"

              name="password"

              type="password"

              autoComplete="current-password"

              required

              placeholder="••••••••"

              value={formData.password}

              onChange={handleChange}

            />

          </div>



          <div>

            <button

              type="submit"

              className={`btn ${loading ? "btn-loading" : ""}`}

              disabled={loading}

            >

              {loading ? (

                <>

                  <span className="btn-spinner"></span>

                  Signing in...

                </>

              ) : (

                "Sign in"

              )}

            </button>

          </div>

        </form>



        <div className="form-footer">
          <Link
            to="/forgot-password"
            className="text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

      </div>

    </div>

  );

};



export default LoginPage;

