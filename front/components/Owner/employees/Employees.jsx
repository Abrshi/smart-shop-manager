"use client";

import React, { useEffect, useState } from "react";
import { axiosbaseurl } from "../../../axios/axios";
import {
  Building2,
  Users,
  Mail,
  Phone,
  ShieldCheck,
  Loader2,
  Plus,
  Store,
  GitBranch,
  Search,
} from "lucide-react";

function Employees() {
  const [shops, setShops] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [selectedShop, setSelectedShop] = useState(null);
  const [branches, setBranches] = useState([]);

  const [loadingShops, setLoadingShops] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    shop_id: "",
    branch_id: "",
    phone_number: "",
  });

  // =========================
  // FETCH SHOPS
  // =========================
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoadingShops(true);

        const res = await axiosbaseurl.get("/owner/getShops");

        setShops(res.data);
      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        setLoadingShops(false);
      }
    };

    fetchShops();
  }, []);

  // =========================
  // FETCH EMPLOYEES
  // =========================
  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);

      const res = await axiosbaseurl.get("/owner/getEmployees");

      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // =========================
  // LOAD BRANCHES
  // =========================
  useEffect(() => {
    if (selectedShop) {
      const shop = shops.find(
        (s) => s.shop_id === Number(selectedShop)
      );

      setBranches(shop?.branches || []);
    } else {
      setBranches([]);
    }
  }, [selectedShop, shops]);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await axiosbaseurl.post("/owner/addEmployee", form);

      fetchEmployees();

      setForm({
        name: "",
        email: "",
        password: "",
        role: "",
        shop_id: "",
        branch_id: "",
        phone_number: "",
      });

      setSelectedShop(null);

      alert("Employee added successfully 🎉");
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // FILTER EMPLOYEES
  // =========================
  const filteredEmployees = employees.filter((emp) => {
    const fullName =
      `${emp.user?.first_name || ""} ${emp.user?.father_name || ""}`.toLowerCase();

    return (
      fullName.includes(search.toLowerCase()) ||
      emp.user?.email?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* =========================
            HEADER
        ========================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              Employees Management
            </h1>

            <p className="text-slate-400 mt-2">
              Manage your staff, branches, and permissions ✨
            </p>
          </div>

          {/* STATS */}
          <div className="flex gap-4">

            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 min-w-[140px]">
              <p className="text-slate-400 text-sm">Employees</p>
              <h2 className="text-2xl font-bold">
                {employees.length}
              </h2>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 min-w-[140px]">
              <p className="text-slate-400 text-sm">Shops</p>
              <h2 className="text-2xl font-bold">
                {shops.length}
              </h2>
            </div>

          </div>
        </div>

        {/* =========================
            EMPLOYEE TABLE
        ========================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">

          <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h2 className="text-xl font-semibold">
                Employee List
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                View and manage all employees
              </p>
            </div>

            {/* SEARCH */}
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />

              <input
                type="text"
                placeholder="Search employees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-800/70 text-slate-300">
                <tr>
                  <th className="text-left p-4">Employee</th>
                  <th className="text-left p-4">Role</th>
                  <th className="text-left p-4">Shop</th>
                  <th className="text-left p-4">Branch</th>
                  <th className="text-left p-4">Phone</th>
                </tr>
              </thead>

              <tbody>

                {loadingEmployees ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-10 text-center"
                    >
                      <div className="flex items-center justify-center gap-3 text-slate-400">
                        <Loader2 className="animate-spin w-5 h-5" />
                        Loading employees...
                      </div>
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-10 text-center text-slate-400"
                    >
                      No employees found 🌑
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr
                      key={emp.employee_id}
                      className="border-t border-slate-800 hover:bg-slate-800/40 transition"
                    >
                      <td className="p-4">

                        <div className="flex items-center gap-3">

                          <div className="w-11 h-11 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-400" />
                          </div>

                          <div>
                            <h3 className="font-medium">
                              {emp.user?.first_name}{" "}
                              {emp.user?.father_name}
                            </h3>

                            <p className="text-sm text-slate-400 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {emp.user?.email}
                            </p>
                          </div>

                        </div>

                      </td>

                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                          {emp.user?.role}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-slate-400" />
                          {emp.shop?.name || "-"}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-4 h-4 text-slate-400" />
                          {emp.branch?.name || "-"}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400" />
                          {emp.user?.phone_number || "-"}
                        </div>
                      </td>
                    </tr>
                  ))
                )}

              </tbody>

            </table>
          </div>
        </div>

        {/* =========================
            FORM
        ========================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">

          <div className="mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-400" />
              Add New Employee
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Create employee accounts and assign branches
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >

            {/* NAME */}
            <InputField
              icon={<Users size={18} />}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
            />

            {/* EMAIL */}
            <InputField
              icon={<Mail size={18} />}
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
            />

            {/* PHONE */}
            <InputField
              icon={<Phone size={18} />}
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              placeholder="Phone Number"
            />

            {/* PASSWORD */}
            <InputField
              icon={<ShieldCheck size={18} />}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Temporary Password"
              type="password"
            />

            {/* ROLE */}
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Role</option>
              <option value="ADMIN">Admin</option>
              <option value="CASHIER">Cashier</option>
              <option value="STAFF">Shopkeeper</option>
            </select>

            {/* SHOP */}
            <select
              name="shop_id"
              value={form.shop_id}
              onChange={(e) => {
                handleChange(e);
                setSelectedShop(e.target.value);
              }}
              disabled={loadingShops}
              className="bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                {loadingShops
                  ? "Loading shops..."
                  : "Select Shop"}
              </option>

              {shops.map((shop) => (
                <option
                  key={shop.shop_id}
                  value={shop.shop_id}
                >
                  {shop.name}
                </option>
              ))}
            </select>

            {/* BRANCH */}
            <select
              name="branch_id"
              value={form.branch_id}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Branch</option>

              {branches.map((b) => (
                <option
                  key={b.branch_id}
                  value={b.branch_id}
                >
                  {b.name}
                </option>
              ))}
            </select>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={submitting}
              className="md:col-span-2 h-14 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Creating Employee...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add Employee
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

// =========================
// REUSABLE INPUT
// =========================
function InputField({
  icon,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div className="relative">

      <div className="absolute left-3 top-3.5 text-slate-400">
        {icon}
      </div>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default Employees;