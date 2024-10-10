import Head from "next/head";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <main>
      <Navbar/>
      <Head>
        <title>Supplywise</title>
        <meta name="description" content="Your solution for inventory management" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-container">
        <div className="content position-absolute top-40 start-20">
          <h1 className="title" style={{fontSize: "80px"}}>Welcome to Supplywise</h1>
          <h1 className="description" style={{color: "rgba(200, 200, 200, 1)"}}>
            Your solution for inventory management
          </h1>
        </div>
      </div>
    </main>
  );
}
