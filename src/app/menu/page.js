import React from 'react';
import Menu from './menu';
import Navbar from '../components/Navbar'; // Corrected from 'Navber' to 'Navbar'

const Page = () => {
  return (
    <>
      <Navbar />
      <Menu />
    </>
  );
}

export default Page;
