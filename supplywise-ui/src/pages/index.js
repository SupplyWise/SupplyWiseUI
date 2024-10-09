import Head from "next/head";
import Navbar from "@/components/navbar";
import { useState, useEffect } from 'react';




export default function Home() {
  return (
    <main>
      <Navbar/>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
    
      </div>
    </main>
  );
}