import Image from "next/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            
            {/* এখানে তোমার মেইন কন্টেন্ট বা পেজের বাকি অংশ থাকবে */}
            <main className="flex-grow">
                {/* Content goes here */}
            </main>

            <Footer />
        </div>
    );
}