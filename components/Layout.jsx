import React from 'react';
import Head from 'next/head';

import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className='layout'>
      <Head>
        <title>Utkarsh Store</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Modern Full Stack E-Commerce Application created by Utkarsh Pathrabe using NextJS, ReactJS, Stripe and Sanity" />
        <meta name="keywords" content="E-Commerce, Utkarsh Pathrabe, NextJS, ReactJS, Sanity, Stripe" />
      </Head>
      <header>
        <Navbar />
      </header>
      <main className='main-container'>
        { children }
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
