"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Slider from "./components/slider";
import Footer from "./components/footer";
import Promotion from "./components/promotion";
import Suggestion from "./components/suggestion"
import Filter from "./components/filter"
import Shops from "./components/shops"
import Shopssmall from "./components/shopssmall"
import Offer from "./components/offer";
import SliderMini from "./components/slidermini";
import Title from "./components/title";
import Title_two from "./components/title_two";
import Title_three from "./components/title_three";
import RoleSwitcher from "./components/RoleSwitcher";
import DriverDashboard from "./driver/DriverDashboard";
import AdminDashboard from "./admin/AdminDashboard";

export default function Home() {
  const [role, setRole] = useState("customer");

  useEffect(() => {
    const savedRole = localStorage.getItem("fudduRole");
    if (savedRole) setRole(savedRole);
  }, []);

  const changeRole = (nextRole) => {
    setRole(nextRole);
    localStorage.setItem("fudduRole", nextRole);
  };

  return (
    <>
      <RoleSwitcher role={role} onRoleChange={changeRole} />
      {role === "driver" ? (
        <DriverDashboard />
      ) : role === "admin" ? (
        <AdminDashboard />
      ) : (
        <>
          <Navbar />
          <Title />
          <SliderMini />
          <Slider />
          <Filter />

          <Title_two />
          <Shopssmall />
          <Shops />
          <Title_three />
          <Offer />

          <Suggestion />
          <Promotion />
          <Footer />
        </>
      )}
    </>
  );
}
