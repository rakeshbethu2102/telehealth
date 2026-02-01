import React from 'react';

const Logo = ({ width = 40, height = 40, className = "" }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Background Circle */}
      <circle cx="50" cy="50" r="45" fill="white" />
      <circle cx="50" cy="50" r="45" stroke="#007bff" strokeWidth="8" fill="none" />
      
      {/* Heart Shape */}
      <path 
        d="M50 75C50 75 20 55 20 35C20 25 28 18 37 18C42 18 47 21 50 25C53 21 58 18 63 18C72 18 80 25 80 35C80 55 50 75 50 75Z" 
        fill="#007bff" 
      />
      
      {/* Pulse Line */}
      <path 
        d="M30 45H40L45 30L55 60L60 45H70" 
        stroke="white" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none"
      />
    </svg>
  );
};

export default Logo;
