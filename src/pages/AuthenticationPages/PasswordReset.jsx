
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import forgotPasswordImg from '@/assets/forgot-password-animate.svg';
import { PasswordResetForm } from '@/components/forget_password_3';
import logo from '@/assets/gradifyLogo.svg'
export default function PasswordReset() {
    const ref = useRef(null)
    return (
      <div 
        className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium">
              <div className="flex h-6 w-6 items-center justify-center rounded-md border border-solid border-primary text-primary-foreground">
                <img src={logo} alt="Logo" className="h-6 w-6" />
              </div>
              Gradify
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <PasswordResetForm />
            </div>
          </div>
        </div>
        <div className="hidden lg:flex flex-col items-center relative justify-center bg-primary shadow-2xs">
          <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.3,
                  duration: 0.6,
                  ease: "easeOut",
                },
              }}
              className="flex flex-col h-auto items-center justify-center text-white gap-2"
            >
              <h1 className="text-6xl font-bold">Gradify</h1>
              <h3 className="text-xl font-bold italic">Learning Reoptimized</h3>
          </motion.div>
          <img
            src={forgotPasswordImg}
            alt="Image"
            className="animated w-128 h-128"
          />
        </div>
      </div>
    )
  }