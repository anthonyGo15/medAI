import React from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import { FaHeartbeat, FaStethoscope, FaUserMd } from 'react-icons/fa';

function BackgroundAnimation() {
  // Variantes para animar círculos
  const circleVariants = {
    animate: {
      scale: [1, 1.5, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 4,
        repeat: Infinity,
      },
    },
  };

  // Estilo de los iconos animados
  const iconStyle = {
    position: 'absolute',
    fontSize: '50px',
    opacity: 0.8,
    animation: 'moveIcon 5s infinite',
  };

  return (
    <Box
      position="relative"
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#E3F2FD"
      overflow="hidden"
    >
      {/* Círculos animados */}
      <motion.div
        style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          backgroundColor: '#3F51B5',
          borderRadius: '50%',
        }}
        variants={circleVariants}
        animate="animate"
      />
      <motion.div
        style={{
          position: 'absolute',
          width: '150px',
          height: '150px',
          backgroundColor: '#009688',
          borderRadius: '50%',
          top: '20%',
          left: '60%',
        }}
        variants={circleVariants}
        animate="animate"
      />
      <motion.div
        style={{
          position: 'absolute',
          width: '250px',
          height: '250px',
          backgroundColor: '#FF5722',
          borderRadius: '50%',
          bottom: '10%',
          right: '20%',
        }}
        variants={circleVariants}
        animate="animate"
      />

      {/* Iconos animados */}
      <FaHeartbeat
        style={{
          ...iconStyle,
          top: '10%',
          left: '15%',
          color: '#FF5722',
        }}
      />
      <FaStethoscope
        style={{
          ...iconStyle,
          top: '50%',
          left: '70%',
          color: '#3F51B5',
        }}
      />
      <FaUserMd
        style={{
          ...iconStyle,
          bottom: '20%',
          right: '30%',
          color: '#009688',
        }}
      />
    </Box>
  );
}

export default BackgroundAnimation;
